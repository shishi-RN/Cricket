const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const OBSWebSocket = require("obs-websocket-js").OBSWebSocket;

const obs = new OBSWebSocket();

async function textToSpeech(text) {
  return new Promise(async (resolve, reject) => {
    const voicesDir = path.join(__dirname, "public", "voices");

    if (!fs.existsSync(voicesDir)) {
      fs.mkdirSync(voicesDir, { recursive: true });
    }

    fs.readdirSync(voicesDir).forEach((file) => {
      if (file.endsWith(".mp3") && file !== "stadium.mp3") {
        fs.unlinkSync(path.join(voicesDir, file));
      }
    });

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

    pythonProcess.on("close", async (code) => {
      if (code !== 0 || error) {
        reject(error || `Process exited with code ${code}`);
      } else {
        const publicUrl = `http://127.0.0.1:3000/voices/output_${timestamp}.mp3`;

        // Get audio duration using ffprobe
        const ffprobe = spawn("ffprobe", [
          "-v",
          "error",
          "-show_entries",
          "format=duration",
          "-of",
          "default=noprint_wrappers=1:nokey=1",
          outputFile,
        ]);

        let durationData = "";
        ffprobe.stdout.on("data", (data) => {
          durationData += data.toString();
        });

        ffprobe.on("close", async (code) => {
          if (code === 0) {
            const duration = parseFloat(durationData);
            console.log(`Audio duration: ${duration} seconds`);

            // Connect to OBS and mute Browser 6
            try {
              await obs.connect("ws://207.180.228.215:4455", "123456");
              console.log("✅ Connected to OBS!");

              await obs.call("SetInputMute", {
                inputName: "Browser 6",
                inputMuted: true, // <-- Correct field name
              });
              console.log("🔇 Muted Browser 6");
              
              // Unmute after duration
              setTimeout(async () => {
                await obs.call("SetInputMute", {
                  inputName: "Browser 6",
                  inputMuted: false, // <-- Correct field name
                });
                console.log("🔊 Unmuted Browser 6");
              
                await obs.disconnect();
                console.log("❌ Disconnected from OBS");
              }, duration * 1000);
              // Convert seconds to milliseconds
            } catch (obsError) {
              console.error("OBS Error:", obsError);
              reject(obsError);
            }
          } else {
            console.error("Error obtaining audio duration.");
            reject("Error obtaining audio duration.");
          }
        });
      }
    });
  });
}

module.exports = textToSpeech;
