const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

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
        reject(error || `Process exited with code ${code}`);
      } else {
        // Public URL with timestamp
        const publicUrl = `http://127.0.0.1:3000/voices/output_${timestamp}.mp3`;
        resolve(publicUrl);
      }
    });
  });
}

module.exports = textToSpeech;