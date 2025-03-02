const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const OBSWebSocket = require("obs-websocket-js").OBSWebSocket;

// Updated textToSpeech function returning both public URL and duration
function textToSpeech(text) {
  return new Promise((resolve, reject) => {
    const voicesDir = path.join(__dirname, "public", "voices");

    // Ensure the directory exists
    if (!fs.existsSync(voicesDir)) {
      fs.mkdirSync(voicesDir, { recursive: true });
    }

    // Delete old .mp3 files except stadium.mp3
    fs.readdirSync(voicesDir).forEach(file => {
      if (file.endsWith(".mp3") && file !== "stadium.mp3") {
        fs.unlinkSync(path.join(voicesDir, file));
      }
    });

    // Generate timestamped filename
    const timestamp = Date.now();
    const outputFile = path.join(voicesDir, `output_${timestamp}.mp3`);

    const pythonProcess = spawn("python3", [
      path.join(__dirname, "tts.py"),
      text,
      outputFile,
    ]);

    let error = "";

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0 || error) {
        return reject(error || `Process exited with code ${code}`);
      } else {
        // Public URL with timestamp
        const publicUrl = `http://127.0.0.1:3000/voices/output_${timestamp}.mp3`;

        // Spawn ffprobe to get audio duration (make sure ffmpeg/ffprobe is installed)
        const ffprobe = spawn("ffprobe", [
          "-v", "error",
          "-show_entries", "format=duration",
          "-of", "default=noprint_wrappers=1:nokey=1",
          outputFile,
        ]);

        let durationData = "";
        ffprobe.stdout.on("data", (data) => {
          durationData += data.toString();
        });

        ffprobe.on("close", (code) => {
          if (code === 0) {
            const duration = parseFloat(durationData);
            console.log(`Audio duration: ${duration} seconds`);
            resolve({ publicUrl, duration });
          } else {
            console.error("Error obtaining audio duration.");
            // Still resolve with duration 0 in case of error
            resolve({ publicUrl, duration: 0 });
          }
        });
      }
    });
  });
}

// Function to mute browser 6 during TTS playback
async function muteBrowserDuringTTS(text) {
  const obs = new OBSWebSocket();
  try {
    // Connect to OBS
    await obs.connect('ws://207.180.228.215:4455', '123456');
    console.log("Connected to OBS");

    // Mute the "browser 6" source
    await obs.send('SetMute', { source: 'browser 6', mute: true });
    console.log("Browser 6 muted");

    // Generate the TTS audio and get its duration
    const { publicUrl, duration } = await textToSpeech(text);
    console.log("TTS audio available at:", publicUrl);

    // After the duration of the audio, unmute the source
    setTimeout(async () => {
      await obs.send('SetMute', { source: 'browser 6', mute: false });
      console.log("Browser 6 unmuted");
      await obs.disconnect();
    }, duration * 1000);

  } catch (error) {
    console.error("Error with OBS or TTS:", error);
  }
}

// Example usage
muteBrowserDuringTTS("Hello, this is a test of text to speech.");
