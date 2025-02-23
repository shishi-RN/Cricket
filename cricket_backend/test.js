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
const fielding = [
    // Off side positions
    "Slips",
    "Fly Slip",
    "Gully",
    "Silly Point",
    "Silly Mid-Off",
    "Point",
    "Backward Point",
    "Cover",
    "Extra Cover",
    "Mid-Off",
    "Deep Backward Point",
    "Deep Point",
    "Deep Cover",
    "Deep Extra Cover",
    "Long Off",
    "Third Man",
  
    // Leg side positions
    "Wicket Keeper",
    "Leg Slip",
    "Leg Gully",
    "Silly Mid-On",
    "Short Leg",
    "Mid-On",
    "Mid-Wicket",
    "Square Leg",
    "Backward Square Leg",
    "Fine Leg",
    "Deep Mid-Wicket",
    "Deep Square Leg",
    "Deep Fine Leg",
    "Long On",
    "Cow Corner",
    "Long Leg"
  ];
  function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  const fieldingPositions = [
    { name: "0 degree position", angle: degreesToRadians(0), distance: 200 },
    { name: "90 degree position", angle: degreesToRadians(90), distance: 200 },
    { name: "180 degree position", angle: degreesToRadians(180), distance: 200 },
    { name: "270 degree position", angle: degreesToRadians(270), distance: 200 },
    { name: "360 degree position", angle: degreesToRadians(360), distance: 200 },
    { name: "slips", angle: -0.464, distance: 188 },
    { name: "fly slip", angle: -0.305, distance: 201 },
    { name: "gully", angle: -0.424, distance: 145 },
    { name: "silly point", angle: -0.785, distance: 50 },
    { name: "silly mid off", angle: -0.262, distance: 50 },
    { name: "point", angle: -1.112, distance: 180 },
    { name: "backward point", angle: -1.816, distance: 247 },
    { name: "cover", angle: -1.849, distance: 153 },
    { name: "extra cover", angle: -1.429, distance: 180 },
    { name: "mid-off", angle: -2.549, distance: 127 },
    { name: "third man", angle: -0.636, distance: 200 },
    { name: "short third man", angle: -0.336, distance: 200 },
    { name: "deep backward point", angle: -0.436, distance: 205 },
    { name: "deep point", angle: -1.312, distance: 312 },
    { name: "deep cover", angle: -1.849, distance: 190 },
    { name: "deep extra cover", angle: -1.429, distance: 212 },
    { name: "long-off", angle: -2.549, distance: 192 },
    { name: "wicket keeper", angle: 0.000, distance: 140 },
    { name: "leg slip", angle: 0.262, distance: 160 },
    { name: "leg gully", angle: 0.524, distance: 170 },
    { name: "silly mid on", angle: 0.785, distance: 140 },
    { name: "short leg", angle: 1.402, distance: 20 },
    { name: "mid-on", angle: 2.247, distance: 150 },
    { name: "mid-wicket", angle: 1.771, distance: 130 },
    { name: "square leg", angle: 0.675, distance: 130 },
    { name: "backward square leg", angle: 0.687, distance: 150 },
    { name: "fine leg", angle: 1.047, distance: 210 },
    { name: "long-on", angle: 2.847, distance: 210 },
    { name: "cow corner", angle: 1.571, distance: 310 },
    { name: "deep mid-wicket", angle: 2.000, distance: 210 },
    { name: "deep mid", angle: 2.000, distance: 210 },
    { name: "deep square leg", angle: 1.087, distance: 200 },
    { name: "deep fine leg", angle: 1.047, distance: 300 },
    { name: "long leg", angle: 1.122, distance: 310 },
    { name: "deep square", angle: 1.087, distance: 200 },
    { name: "square of the wicket", angle: -1.849, distance: 190 },
  ];
  

io.on("connection", (socket) => {
    socket.emit("fielding-positions", fieldingPositions);
});

app.post("/trigger-animation", (req, res) => {
    const { fieldingPosition, bowlerImg, batterImg, shotType } = req.body;
console.log(req.body)
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

// Update valid shots array
const validShots = ["dot", "single", "double", "triple", "four", "six"];

// Update validation function
function validateInput({ fieldingPosition, bowlerImg, batterImg, shotType }) {
    const validPositions = fieldingPositions.map((p) => p.name);
    return (
        validPositions.includes(fieldingPosition) &&
        validShots.includes(shotType) &&
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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
