const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// Updated fielding positions covering the full 360° of a cricket ground.
// Assumption: The batsman is positioned at the north end (angle = -Math.PI/2).
const fieldingPositions = [
  { name: "Wicketkeeper", angle: -Math.PI / 2, distance: 50 },
  { name: "Silly Point", angle: -Math.PI / 2 + 0.1, distance: 80 },
  { name: "Slip", angle: -Math.PI / 2 + 0.2, distance: 120 },
  { name: "Gully", angle: -Math.PI / 2 + 0.4, distance: 150 },
  { name: "Point", angle: -Math.PI / 2 + 0.8, distance: 180 },
  { name: "Cover", angle: -Math.PI / 2 + 1.0, distance: 200 },
  { name: "Mid-off", angle: -Math.PI / 2 + 1.2, distance: 250 },
  { name: "Third Man", angle: -Math.PI / 2 + 1.4, distance: 350 },
  { name: "Mid-on", angle: -Math.PI / 2 - 1.2, distance: 250 },
  { name: "Square Leg", angle: -Math.PI / 2 - 1.0, distance: 180 },
  { name: "Short Leg", angle: -Math.PI / 2 - 0.1, distance: 80 },
  { name: "Fine Leg", angle: -Math.PI / 2 - 0.8, distance: 350 },
  { name: "Long On", angle: -Math.PI / 2 - 0.4, distance: 360 },
  { name: "Long Off", angle: -Math.PI / 2 + 0.4, distance: 360 }
];

io.on("connection", (socket) => {
  socket.emit("fielding-positions", fieldingPositions);
});

app.post("/trigger-animation", (req, res) => {
  const { fieldingPosition, bowlerImg, batterImg, shotType } = req.body;

  if (!validateInput(req.body)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  io.emit("animate", {
    fieldingPosition,
    bowlerImg,
    batterImg,
    shotType: shotType.toLowerCase(),
  });

  res.json({ status: "Animation triggered" });
});

// Valid shot types
const validShots = ["dot", "single", "double", "triple", "four", "six"];

// Validation function updated to check both fielding position and image URLs
function validateInput({ fieldingPosition, bowlerImg, batterImg, shotType }) {
  const validPositions = fieldingPositions.map((p) => p.name);
  return (
    validPositions.includes(fieldingPosition) &&
    validShots.includes(shotType.toLowerCase()) &&
    isValidUrl(bowlerImg) &&
    isValidUrl(batterImg)
  );
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
