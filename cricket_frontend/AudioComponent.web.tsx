import React, {useState, useEffect, useRef} from 'react';
import WebView from 'react-native-webview';

const loopVoice = 'http://127.0.0.1:3000/voices/stadium.mp3';

const audioHtml = `
  <html>
    <body style="margin:0;padding:0;">
      <audio 
        id="loopPlayer" 
        loop 
         muted
        autoplay
        controls 
        playsinline 
        webkit-playsinline
        style="position:absolute;left:-1000px;top:-1000px;"
      >
        <source src="${loopVoice}" type="audio/mpeg">
      </audio>
      <audio 
        id="audioPlayer"
        controls 
        playsinline 
        webkit-playsinline
        style="position:absolute;left:-1000px;top:-1000px;"
      ></audio>
      <script>
        (function() {
          const loopPlayer = document.getElementById('loopPlayer');
          loopPlayer.volume = 0.3;
          loopPlayer.play().catch(e => console.log('Loop play error:', e));
          
          const audioPlayer = document.getElementById('audioPlayer');
          audioPlayer.addEventListener('ended', function() {
            window.ReactNativeWebView.postMessage('NON_LOOP_FINISHED');
          });
        })();
      </script>
    </body>
  </html>
`;

const AudioComponent = ({matchData}) => {
  const webViewRef = useRef(null);
  const [canPlayNonLoop, setCanPlayNonLoop] = useState(true);
  const [audioQueue, setAudioQueue] = useState([]);

  useEffect(() => {
    const nonLoopVoice = matchData?.voice;
    if (nonLoopVoice) {
      if (canPlayNonLoop) {
        playNonLoop(nonLoopVoice);
        setCanPlayNonLoop(false);
      } else {
        setAudioQueue(prev => [...prev, nonLoopVoice]);
      }
    }
  }, [matchData?.voice]);

  const playNonLoop = url => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = "${url}";
        audioPlayer.play()
          .then(() => {
            window.ReactNativeWebView.postMessage('NON_LOOP_STARTED');
          })
          .catch(e => console.error('Play error:', e));
        true;
      `);
    }
  };

  const handleMessage = event => {
    const message = event.nativeEvent.data;
    switch (message) {
      case 'NON_LOOP_STARTED':
        setCanPlayNonLoop(false);
        break;
      case 'NON_LOOP_FINISHED':
        if (audioQueue.length > 0) {
          const nextUrl = audioQueue[0];
          playNonLoop(nextUrl);
          setAudioQueue(prev => prev.slice(1));
        } else {
          setCanPlayNonLoop(true);
        }
        break;
      default:
        console.log('Unknown message:', message);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{html: audioHtml}}
      style={{height: 0, width: 0}}
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback={true}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      onLoad={() => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`
            const loopPlayer = document.getElementById('loopPlayer');
            if (loopPlayer && loopPlayer.paused) {
              loopPlayer.play().catch(console.error);
            }
            true;
          `);
        }
      }}
      onLoadEnd={() => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`
            const loopPlayer = document.getElementById('loopPlayer');
            if (loopPlayer && loopPlayer.paused) {
              loopPlayer.play().catch(console.error);
            }
            true;
          `);
        }
      }}
      onError={syntheticEvent => {
        const {nativeEvent} = syntheticEvent;
        console.error('WebView error:', nativeEvent);
      }}
    />
  );
};
