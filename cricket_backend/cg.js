const { exec } = require("child_process");
const path = require("path");

function removeBackground(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const command = `pip3 backgroundremover -i "${inputPath}" -o "${outputPath}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(outputPath);
    });
  });
}

// Usage
removeBackground("input.jpg", "output.png")
  .then(output => console.log("Saved to:", output))
  .catch(err => console.error("Error:", err));