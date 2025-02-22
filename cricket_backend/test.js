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
    { name: "0° Position", angle: degreesToRadians(0), distance: 200 },
    { name: "90° Position", angle: degreesToRadians(90), distance: 200 },
    { name: "180° Position", angle: degreesToRadians(180), distance: 200 },
    { name: "270° Position", angle: degreesToRadians(270), distance: 200 },
    { name: "360° Position", angle: degreesToRadians(360), distance: 200 } ,
    // Off side positions (recalculated from HTML layout)
    { name: "Slips",                 angle: -0.464, distance: 188 },  // Average of two slip markers
    { name: "Fly Slip",              angle: -0.305, distance: 201 },  // (Guessed from an estimated fly-slip location)
    { name: "Gully",                 angle: -0.424, distance: 145 },  // From HTML “Gully” at (40%,28%)
    { name: "Silly Point",           angle: -0.785, distance:  50 },  // Chosen to be very close in
    { name: "Silly Mid-Off",         angle: -0.262, distance:  50 },  // Adjusted to be near the bowler’s line
    { name: "Point",                 angle:-1.112, distance:180 },  // From HTML “Point” at (15%,45%)
    { name: "Backward Point",        angle: -1.816, distance: 247 },  // From HTML “Back Point” at (10%,40%)
    { name: "Cover",                 angle: -1.849, distance: 153 },  // From HTML “Cover” at (25%,55%)
    { name: "Extra Cover",           angle: -1.429, distance: 180 },  // From HTML “Extra Cover” at (20%,50%)
    { name: "Mid-Off",               angle: -2.549, distance: 127 },  // From HTML “Mid Off” at (35%,65%)
    { name: "Third Man",             angle: -0.636, distance: 200 },
    { name: "Short Third Man",       angle: -0.336, distance: 200 },  // From HTML “Third Man” at (25%,5%)
    { name: "Deep Backward Point",   angle: -0.436, distance: 205 },  // From HTML “Deep Back Point” at (5%,35%)
    { name: "Deep Point",            angle: -1.312, distance: 312 },  // Approximated as “Point” pushed deeper
    { name: "Deep Cover",            angle: -1.849, distance: 190 },  // From HTML “Deep Cover” at (20%,60%)
    { name: "Deep Extra Cover",      angle: -1.429, distance: 212 },  // From HTML “Deep Extra Cover” at (15%,55%)
    { name: "Long Off",              angle: -2.549, distance: 192 },  // From HTML “Long Off” at (30%,75%)
  
    // Leg side positions (values retained from original approximations)
    { name: "Wicket Keeper",         angle:  0.000, distance: 140 },
    { name: "Leg Slip",              angle:  0.262, distance: 160 },
    { name: "Leg Gully",             angle:  0.524, distance: 170 },
    { name: "Silly Mid-On",          angle:  0.785, distance: 140 },
    { name: "Short Leg",             angle:  1.402, distance: 20 },
    { name: "Mid On",                angle:  2.247, distance: 150 },
    { name: "Mid-Wicket",            angle:  1.771, distance: 130 },
    { name: "Square Leg",            angle: 0.675, distance:130},
    { name: "Backward Square Leg",   angle:  0.687, distance: 150 },
    { name: "Fine Leg",              angle:  1.047, distance: 210 },
    { name: "Long On",               angle:  2.847, distance: 210 },
    { name: "Cow Corner",            angle:  1.571, distance: 310 },
    { name: "Deep Mid-Wicket",       angle:  2.000, distance: 210 },
    { name: "Deep Square Leg",       angle:  1.087, distance: 200 },
    { name: "Deep Fine Leg",         angle:  1.047, distance: 300 },
    { name: "Long Leg",              angle:  1.122, distance: 310 }
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

// Update valid shots array
const validShots = ["dot", "single", "double", "triple", "four", "six"];

// Update validation function
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
