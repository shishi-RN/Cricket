import React, {useEffect, useState, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  Dimensions,
  PixelRatio,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {WebView} from 'react-native-webview';
import BlurView from '@react-native-community/blur/lib/typescript/components/BlurView.ios';
import {Image} from 'react-native-svg';
const {width, height} = Dimensions.get('window');

// Responsive scaling functions
const scaleFont = size => {
  const scaleFactor = PixelRatio.getFontScale();
  return PixelRatio.roundToNearestPixel(
    size * Math.min(width / 375, height / 667) * scaleFactor,
  );
};

const scaleSize = size => PixelRatio.roundToNearestPixel(size * (width / 375));
const scaleHorizontal = size =>
  PixelRatio.roundToNearestPixel(size * (width / 375));
const scaleVertical = size =>
  PixelRatio.roundToNearestPixel(size * (height / 667));

const FLAG_ASPECT_RATIO = 3 / 2;

const App = () => {
  const [audioHtml, setAudioHtml] = useState('');
  const webViewRef = useRef(null);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 2000, // Rotation duration in milliseconds
        useNativeDriver: true,
      }),
    ).start();
  }, [rotationAnim]);

  const apiData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/match-data');
      console.log(response.data, 'heereee');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  console.log(matchData?.voice);
  const loopVoice = 'http://127.0.0.1:3000/voices/stadium.mp3';
  useEffect(() => {
    const nonLoopVoice = matchData?.voice;

    if (nonLoopVoice || loopVoice) {
      const newAudioHtml = `
        <html>
          <body style="margin:0;padding:0;">
            ${
              nonLoopVoice
                ? `
              <audio 
                id="audioPlayer" 
                autoplay 
                controls 
                playsinline 
                webkit-playsinline
                style="position:absolute;left:-1000px;top:-1000px;"
              >
                <source src="${nonLoopVoice}" type="audio/mpeg">
              </audio>
            `
                : ''
            }
            
            ${
              loopVoice
                ? `
              <audio 
                id="loopPlayer" 
                autoplay 
                loop 
                controls 
                playsinline 
                webkit-playsinline
                style="position:absolute;left:-1000px;top:-1000px;"
              >
                <source src="${loopVoice}" type="audio/mpeg">
              </audio>
            `
                : ''
            }
  
            <script>
              document.addEventListener('DOMContentLoaded', () => {
                ${
                  nonLoopVoice
                    ? `
                  document.getElementById('audioPlayer')?.play()
                    .catch(e => console.log('Non-loop play error:', e));
                `
                    : ''
                }
                
                ${
                  loopVoice
                    ? `
                  const loopPlayer = document.getElementById('loopPlayer');
                  if (loopPlayer) {
                    loopPlayer.volume = 0.2;  // Set volume to 30%
                    loopPlayer.play()
                      .catch(e => console.log('Loop play error:', e));
                  }
                `
                    : ''
                }
              });
            </script>
          </body>
        </html>
      `;
      setAudioHtml(newAudioHtml);
    }
  }, [matchData?.voice, loopVoice]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiData();
        setMatchData(data);
        setLoading(false);

        // Start the fade-in animation after data is loaded
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    // Fetch data immediately on component mount
    fetchData();

    // Set up interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 13000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fadeAnim]);
  const sortedInnings =
    matchData?.match?.sort((a, b) => a.inningsId - b.inningsId) || [];
  const firstInnings = sortedInnings[0];
  const secondInnings = sortedInnings[1];

  const partnershipText = `${matchData?.partnership?.runs ?? '0'}(${
    matchData?.partnership?.balls ?? '0'
  })`;
  const tossText = `${matchData?.toss.tossWinnerName} won toss & chose ${matchData?.toss.decision}`;
  const striker = matchData?.batsmanStriker;
  const nonStriker = matchData?.batsmanNonStriker;
  const bowler = matchData?.bowler;
  const strikerText = `${striker?.batName ?? '0'}: ${striker?.batRuns ?? '0'}(${
    striker?.batBalls ?? '0'
  })`;
  const nonStrikeText = `${nonStriker?.batName ?? '0'}: ${
    nonStriker?.batRuns ?? '0'
  }(${nonStriker?.batBalls ?? '0'})`;
  const strikeRateText = `Strike Rate: ${(striker?.batStrikeRate ?? 0).toFixed(
    2,
  )}`;
  const foursSixesText = `4s/6s: ${striker?.batFours ?? '0'}/${
    striker?.batSixes ?? '0'
  }`;
  const nonstrikeRateText = `Strike Rate: ${(
    nonStriker?.batStrikeRate ?? 0
  ).toFixed(2)}`;
  const nonfoursSixesText = `4s/6s: ${nonStriker?.batFours ?? '0'}/${
    nonStriker?.batSixes ?? '0'
  }`;
  const bowlerRate = `Overs: ${bowler?.bowlOvs ?? '0'} Runs: ${
    bowler?.bowlRuns ?? '0'
  }\nWickets: ${bowler?.bowlWkts ?? '0'} \n Economy: ${
    bowler?.bowlEcon ?? '0'
  }`;
  const lastValue = matchData?.recentOvsStats?.trim().split(' ').pop();
  const getEventValue = event => {
    if (!event || event === 'NONE') return lastValue;
    if (event.includes('_')) return 'BALL';
    if (event.includes('OVER-BREAK')) return 'OVER';
    if (event.includes('FIFTY')) return 'FIFTY';
    if (event.includes('HUNDRED')) return 'HUNDRED';
    return event;
  };

  const eventValue = getEventValue(matchData?.event);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        key={audioHtml}
        source={{html: audioHtml}}
        style={{height: 0, width: 0}}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        javaScriptEnabled
        onLoadEnd={() => {
          // Secondary play attempt after load
          webViewRef?.current.injectJavaScript(`
      const player = document.getElementById('audioPlayer');
      if (player) {
        player.play().catch(error => console.log('Final play attempt:', error));
      }
      true;
    `);
        }}
      />

      {/* Top Section - Match Status */}
      <LinearGradient
        colors={['#000000', '#434343']}
        style={[styles.box, {flex: 0.3 * (height / 667)}]}>
        <View style={styles.flagContainer}>
          <Animated.Image
            source={{
              uri:
                firstInnings?.teamImage ||
                'https://example.com/default-flag.png',
            }}
            style={[
              styles.flag,
              {
                width: width * 0.15,
                height: (width * 0.2) / FLAG_ASPECT_RATIO,
                borderWidth: scaleSize(2),
                borderRadius: scaleSize(4),
              },
            ]}
            resizeMode="cover"
          />

          <View style={styles.scoreContainer}>
            <Animated.Text
              style={[
                styles.teamName,
                {fontSize: scaleFont(42), opacity: fadeAnim},
              ]}>
              {firstInnings?.batTeamName ?? 'Team 1'}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.score,
                {fontSize: scaleFont(42), opacity: fadeAnim},
              ]}>
              {firstInnings?.score ?? 0}/{firstInnings?.wickets ?? 0}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.over,
                {fontSize: scaleFont(32), opacity: fadeAnim},
              ]}>
              Over: {firstInnings?.overs ?? 0.0}
            </Animated.Text>
          </View>

          <View
            style={[
              styles.progressContainer,
              {
                width: scaleHorizontal(70),
                borderRadius: scaleSize(30),
                borderWidth: scaleSize(1),
                marginTop: scaleVertical(20),
              },
            ]}>
            <Animated.Text
              style={[
                styles.teamName,
                {
                  fontSize:
                    matchData?.event === 'WICKET'
                      ? scaleFont(35)
                      : scaleFont(55),
                  justifyContent: 'center',
                  alignSelf: 'center',
                  textAlign: 'center', // Ensures the text is centered
                  opacity: rotationAnim,
                },
              ]}
              numberOfLines={2} // Limits to a single line
              ellipsizeMode="tail" // Adds "..." if the text overflows
              adjustsFontSizeToFit // Dynamically decreases font size (iOS specific)
            >
              {matchData?.event === 'NONE' ? lastValue : eventValue ?? 'BALL'}
            </Animated.Text>
          </View>

          <View style={styles.scoreContainer}>
            <Animated.Text
              style={[
                styles.teamName,
                {fontSize: scaleFont(42), opacity: fadeAnim},
              ]}>
              {secondInnings?.batTeamName ?? 'Team 2'}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.score,
                {fontSize: scaleFont(42), opacity: fadeAnim},
              ]}>
              {secondInnings?.score ?? 0}/{secondInnings?.wickets ?? 0}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.over,
                {fontSize: scaleFont(32), opacity: fadeAnim},
              ]}>
              Over: {secondInnings?.overs ?? 0.0}
            </Animated.Text>
          </View>

          <Animated.Image
            source={{
              uri:
                secondInnings?.teamImage ||
                'https://example.com/default-flag.png',
            }}
            style={[
              styles.flag,
              {
                width: width * 0.15,
                height: (width * 0.2) / FLAG_ASPECT_RATIO,
                borderWidth: scaleSize(2),
                borderRadius: scaleSize(4),
              },
            ]}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>

      {/* Stats Bar */}
      <LinearGradient
        colors={['#0f2027', '#203a43']}
        style={[styles.box, {flex: 0.1 * (height / 667)}]}>
        <Text
          style={[
            styles.statsText,
            {fontSize: scaleFont(30), marginTop: scaleFont(5)},
          ]}>
          P/S: {partnershipText ?? '00'} | CRR : {matchData?.currentRunrate} |
          RRR : {matchData?.requiredRunRate} |{' '}
          <View style={styles.glassContainer}>
            <Text style={styles.overText}>
              Over: {matchData?.recentOvsStats?.replace(/^.*?\|\s*/, '') ?? '0'}
            </Text>
          </View>
        </Text>
      </LinearGradient>

      {/* Main Content Area */}
      <LinearGradient
        colors={['#3e0000', '#7a0000']}
        style={[styles.box, {flex: 0.4 * (height / 667)}]}>
        <View style={styles.backgroundContainer}>
          <Animated.Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Wankhede_ICC_WCF.jpg',
            }}
            style={[
              styles.backgroundImage,
              {
                width: width,
                height: height * 0.4,
                borderRadius: scaleSize(8),
              },
            ]}
            resizeMode="cover"
          />
          {/* GIF overlay */}
          <Image
            source={require('./assets/four.gif')}
            style={styles.gifImage}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>

      {/* Player Stats */}
      <LinearGradient
        colors={['#2a0a3d', '#531d8a']}
        style={[styles.box, {flex: 0.18 * (height / 667)}]}>
        {/* Striker */}
        <View style={styles.playerStats}>
          {/* Head Image */}

          {matchData?.batsmanStriker?.image?.head && (
            <Animated.Image
              source={{
                uri: matchData?.batsmanStriker?.image?.head,
              }}
              //  style={[styles.image, { bottom: "40%" }]}
              style={[
                {
                  width: 100,
                  height: 100,
                  position: 'absolute',
                  resizeMode: 'contain',
                  bottom: 5,
                  left: '10%',
                },
              ]}
            />
          )}

          {/* Body Image (Same size as head) */}
          {matchData?.batsmanStriker?.image?.body && (
            <Animated.Image
              source={{
                uri: matchData?.batsmanStriker?.image?.body,
              }}
              style={[
                {
                  width: 100,
                  height: 100,
                  position: 'absolute',
                  resizeMode: 'contain',
                  top: 30,
                  left: '10%',
                },
              ]}
            />
          )}

          {matchData?.batsmanStriker?.image?.head && (
            <View style={styles.textContainer}>
              <Text style={[styles.statItem, {fontSize: scaleFont(20)}]}>
                {strikerText}
              </Text>
              <Text style={[styles.statItem, {fontSize: scaleFont(20)}]}>
                {strikeRateText}
              </Text>
              <Text style={[styles.statItem, {fontSize: scaleFont(20)}]}>
                {foursSixesText}
              </Text>
            </View>
          )}
        </View>

        {/* Non-striker */}
        <View style={styles.playerStats}>
          {matchData?.batsmanNonStriker?.image?.head && (
            <Animated.Image
              source={{
                uri: matchData?.batsmanNonStriker?.image?.head,
              }}
              //  style={[styles.image, { bottom: "40%" }]}
              style={[
                {
                  width: 100,
                  height: 100,
                  position: 'absolute',
                  resizeMode: 'contain',
                  bottom: 5,
                  left: '10%',
                },
              ]}
            />
          )}

          {/* Body Image (Same size as head) */}
          {matchData?.batsmanNonStriker?.image?.body && (
            <Animated.Image
              source={{
                uri: matchData?.batsmanNonStriker?.image?.body,
              }}
              style={[
                {
                  width: 100,
                  height: 100,
                  position: 'absolute',
                  resizeMode: 'contain',
                  top: 30,
                  left: '10%',
                },
              ]}
            />
          )}

          {matchData?.batsmanNonStriker?.image?.head && (
            <View style={styles.textContainer}>
              <Text style={[styles.statItem, {fontSize: scaleFont(20)}]}>
                {nonStrikeText}
              </Text>
              <Text style={[styles.statItem, {fontSize: scaleFont(20)}]}>
                {nonstrikeRateText}
              </Text>
              <Text style={[styles.statItem, {fontSize: scaleFont(20)}]}>
                {nonfoursSixesText}
              </Text>
            </View>
          )}
        </View>

        {/* Bowler */}
        <View style={[styles.playerStats, {marginRight: 20}]}>
          <Animated.Image
            source={{
              uri: matchData?.bowler?.image?.head,
            }}
            //  style={[styles.image, { bottom: "40%" }]}
            style={[
              {
                width: 100,
                height: 100,
                position: 'absolute',
                resizeMode: 'contain',
                bottom: 5,
                left: '10%',
              },
            ]}
          />

          {/* Body Image (Same size as head) */}
          <Animated.Image
            source={{
              uri: matchData?.bowler?.image?.body,
            }}
            style={[
              {
                width: 100,
                height: 100,
                position: 'absolute',
                resizeMode: 'contain',
                top: 30,
                left: '10%',
              },
            ]}
          />

          {matchData?.bowler?.image?.head && (
            <View style={styles.textContainer}>
              <Text style={[styles.statItem, {fontSize: scaleFont(20)}]}>
                {bowler?.bowlName}
              </Text>
              <Text style={[styles.statItem, {fontSize: scaleFont(20)}]}>
                {bowlerRate}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Bottom Bar */}
      <LinearGradient
        colors={['#434343', '#000000']}
        style={[styles.box, {flex: 0.14 * (height / 667)}]}>
        <View style={styles.bottomBar}>
          <Text style={[styles.bottomText, {fontSize: scaleFont(16)}]}>
            {`${tossText} \n LW: ${matchData?.lastWicket ?? '0'} \n ${
              matchData?.status
            }`}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flag: {
    overflow: 'hidden',
    borderColor: 'white',
  },
  box: {
    marginVertical: scaleVertical(2),
    overflow: 'hidden',
    flexDirection: 'row',
  },
  flagContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: scaleHorizontal(8),
  },
  scoreContainer: {
    minWidth: width * 0.2,
    alignItems: 'center',
  },
  container2: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  teamName: {
    color: 'white',
    fontFamily: 'rajhadhanibold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
  },
  score: {
    color: 'white',
    fontFamily: 'rajhadhanibold',

    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
  },
  gifImage: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 60,
    height: 60,
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Semi-transparent white
    borderRadius: 20,
    height: '70%',
    paddingHorizontal: 6,
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Subtle border
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android
  },
  statItem: {
    color: 'white',
    fontFamily: 'rajhadhanibold',
    textAlign: 'left', // Align left for better readability
  },
  playerStats: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    left: '50%',
  },
  overText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: scaleFont(30),
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Text shadow for better readability
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },

  over: {
    color: 'yellow',
    fontFamily: 'rajhadhanibold',

    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
  },

  progressContainer: {
    height: '60%',
    backgroundColor: 'black',
    justifyContent: 'center',
    borderColor: 'yellow',
  },
  progressBar: {
    height: '70%',
    backgroundColor: 'yellow',
    marginHorizontal: scaleHorizontal(2),
    borderRadius: scaleSize(25),
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  backgroundImage: {
    opacity: 0.8,
  },
  overlayContent: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: 'flex-end',
  },
  stadiumText: {
    color: 'white',
    fontFamily: 'mudstone',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  // playerStats: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   alignItems: 'center',
  //   paddingHorizontal: scaleHorizontal(16),
  // },
  // statItem: {
  //   color: 'white',
  //   fontFamily: 'rajhadhanibold',
  //   textAlign: 'center',
  // },
  bottomBar: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: scaleHorizontal(16),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
  },
  bottomText: {
    color: 'white',
    fontFamily: 'rajhadhanibold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
  },
  statsText: {
    color: 'white',
    fontFamily: 'rajhadhanibold',
    textAlign: 'center',
    flex: 1,
    textAlignVertical: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
  },
});

export default App;
