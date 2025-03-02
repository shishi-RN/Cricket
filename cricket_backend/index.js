const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Fuse = require("fuse.js");
const textToSpeech = require("./play");
const path = require("path");
const app = express();
app.use(cors());
app.use("/voices", express.static(path.join(__dirname, "public", "voices")));
app.use(express.static(path.join(__dirname, "public")));

// Serve the HTML file on the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const images = [
  {
    name: "IND",
    image: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg",
  },
  {
    name: "NZ",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg",
  },
  {
    name:"RSA",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/800px-Flag_of_South_Africa.svg.png"
  },
  {
    name: "ENG",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_(1-2).svg",
  },
  {
    name: "AUS",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/640px-Flag_of_Australia_%28converted%29.svg.png",
  },
  {
    name: "PAK",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Pakistan.svg/800px-Flag_of_Pakistan.svg.png",
  },
  {
    name: "ZIM",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Zimbabwe.svg/1200px-Flag_of_Zimbabwe.svg.png",
  },
  {
    name: "IRE",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/45/Flag_of_Ireland.svg",
  },

  {
    name: "Rohit Sharma (c)",
    image:
      "https://raw.githubusercontent.com/hdpngworld/HPW/main/uploads/6515d0d42f40b-c.png",
  },
  {
    name: "Shubman Gill",
    image:
      "https://www.pngguru.in/storage/uploads/images/Shubman%20Gill%20Indian%20cricket%20player%20free%20PNG%20photo_1696590812_1798805955.webp",
  },
  {
    name: "Virat Kohli",
    image:
      "https://w7.pngwing.com/pngs/400/994/png-transparent-virat-kohli-thumbnail.png",
  },
  {
    name: "Shreyas Iyer",
    image:
      "https://static-files.cricket-australia.pulselive.com/headshots/440/10922-camedia.png",
  },
  {
    name: "KL Rahul",
    image:
      "https://i.pinimg.com/474x/48/37/af/4837af17a9f1bf260a2a1065332d9cd1.jpg",
  },
  {
    name: "Hardik Pandya",
    image:
      "https://www.pngguru.in/storage/uploads/images/hardik-pandya-indian-cricketer-free-hd-transparent-png-photo_1719995107_1895634568.webp",
  },
  {
    name: "Ravindra Jadeja",
    image:
      "https://cricclubs.com/documentsRep/profilePics/a7c304ce-5c09-4ad9-b495-e9f756ed756d.png",
  },
  {
    name: "Axar Patel",
    image:
      "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_60/lsci/db/PICTURES/CMS/331100/331164.png",
  },
  {
    name: "Kuldeep Yadav",
    image:
      "https://static-files.cricket-australia.pulselive.com/headshots/288/10953-camedia.png",
  },
  {
    name: "Mohammed Shami",
    image:
      "https://www.pngguru.in/storage/uploads/images/Mohammed%20Shami%20Indian%20cricket%20player%20HD%20PNG%20Image_1700145250_290197030.webp",
  },
  {
    name: "Harshit Rana",
    image:
      "https://static-files.cricket-australia.pulselive.com/headshots/288/10208-camedia.png",
  },
  {
    name: "Yashasvi Jaiswal",
    image:
      "https://static-files.cricket-australia.pulselive.com/headshots/440/2993-camedia.png",
  },
  {
    name: "Rishabh Pant",
    image:
      "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_60/lsci/db/PICTURES/CMS/323000/323036.png",
  },
  {
    name: "Varun Chakravarthy",
    image:
      "https://img1.hscicdn.com/image/upload/f_auto/lsci/db/PICTURES/CMS/331100/331167.png",
  },

  {
    name: "Jos Buttler (c)",
    image:
      "https://i.pinimg.com/564x/11/98/64/119864a2399eff84536f86bcf9fb39d8.jpg",
  },
  {
    name: "Philip Salt",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzH_PkECzuLRSkHjO7kMp2CmEM7c0fOpgSsw&s",
  },
  {
    name: "Ben Duckett",
    image:
      "https://static-files.cricket-australia.pulselive.com/headshots/288/67-test.png",
  },
  {
    name: "RSA",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSocgERlMQwAoEfc9oXUVBsxDU_Dzcdri2mg&s",
  },

  {
    name: "Joe Root",
    image: "https://www.espncricinfo.com/inline/content/image/1183220.html",
  },
  {
    name: "Harry Brook",
    image: "https://www.espncricinfo.com/inline/content/image/1183221.html",
  },
  {
    name: "Liam Livingstone",
    image: "https://www.espncricinfo.com/inline/content/image/1183222.html",
  },
  {
    name: "Jamie Smith",
    image: "https://www.espncricinfo.com/inline/content/image/1183223.html",
  },
  {
    name: "Jamie Overton",
    image: "https://www.espncricinfo.com/inline/content/image/1183224.html",
  },
  {
    name: "Jacob Bethell",
    image: "https://www.espncricinfo.com/inline/content/image/1183225.html",
  },
  {
    name: "Gus Atkinson",
    image: "https://www.espncricinfo.com/inline/content/image/1183226.html",
  },
  {
    name: "Jofra Archer",
    image: "https://www.espncricinfo.com/inline/content/image/1183227.html",
  },
  {
    name: "Saqib Mahmood",
    image: "https://www.espncricinfo.com/inline/content/image/1183228.html",
  },
  {
    name: "Adil Rashid",
    image: "https://www.espncricinfo.com/inline/content/image/1183229.html",
  },
  {
    name: "Brydon Carse",
    image: "https://www.espncricinfo.com/inline/content/image/1183230.html",
  },
  {
    name: "Mark Wood",
    image: "https://www.espncricinfo.com/inline/content/image/1183231.html",
  },
  {
    name: "Tom Banton",
    image: "https://www.espncricinfo.com/inline/content/image/1183232.html",
  },
];

const fieldingPositions = [
  { id: 1, name: "slips" },
  { id: 2, name: "fly slip" },
  { id: 3, name: "gully" },
  { id: 4, name: "silly point" },
  { id: 5, name: "silly mid off" },
  { id: 6, name: "point" },
  { id: 7, name: "backward point" },
  { id: 8, name: "cover" },
  { id: 9, name: "extra cover" },
  { id: 10, name: "mid-off" },
  { id: 11, name: "deep backward point" },
  { id: 12, name: "deep point" },
  { id: 13, name: "deep cover" },
  { id: 14, name: "deep extra cover" },
  { id: 15, name: "long-off" },
  { id: 16, name: "third man" },
  { id: 17, name: "wicket keeper" },
  { id: 18, name: "leg slip" },
  { id: 19, name: "leg gully" },
  { id: 20, name: "silly mid on" },
  { id: 21, name: "short leg" },
  { id: 22, name: "mid-on" },
  { id: 23, name: "mid-wicket" },
  { id: 24, name: "square leg" },
  { id: 25, name: "backward square leg" },
  { id: 26, name: "fine leg" },
  { id: 27, name: "deep mid-wicket" },
  { id: 28, name: "deep square leg" },
  { id: 29, name: "deep fine leg" },
  { id: 30, name: "long-on" },
  { id: 31, name: "cow corner" },
  { id: 32, name: "long leg" },
  { id: 33, name: "square of the wicket" },
  { id: 34, name: "deep mid" },
  { id: 35, name: "deep square" },
];

const players = require("./Players/players.json");
function getTeamImage(playerName) {
  const options = {
    keys: ["name"],
    threshold: 0.3, // Adjust this value based on desired matching sensitivity
  };
  const fuse = new Fuse(images, options);
  const result = fuse.search(playerName);

  if (result.length > 0) {
    return result[0].item.image;
  }
  return null; // Return null if no close match is found
}
function shotName(comment) {
  const options = {
    keys: ["name"],
    threshold: 0.3, // Adjust this value based on desired matching sensitivity
  };
  const fuse = new Fuse(fieldingPositions, options);
  const result = fuse.search(comment);
  console.log(result);
  if (result.length > 0) {
    return result[0].item.name;
  }
  return null; // Return null if no close match is found
}
function getPlayerImage(playerName) {
  const options = {
    keys: ["name"],
    threshold: 0.3, // Adjust this value based on desired matching sensitivity
  };
  const fuse = new Fuse(players, options);
  const result = fuse.search(playerName);

  if (result.length > 0) {
    return { head: result[0].item.head, body: result[0].item.body };
  }
  return null; // Return null if no close match is found
}

// Assuming previousComment is defined outside the route so that it persists between API calls
let previousComment = ""; // define globally outside the route

app.get("/match-data", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.cricbuzz.com/api/cricket-match/commentary/112455"
    );

    const { matchHeader, commentaryList, miniscore } = response.data;

    // Retrieve player images using fuzzy matching
    let batsmanNonStrikerImage;
    if (miniscore?.batsmanNonStriker?.batName) {
      batsmanNonStrikerImage = getPlayerImage(
        miniscore.batsmanNonStriker.batName
      );
    }

    let batsmanStrikerImage;
    if (miniscore?.batsmanStriker?.batName) {
      batsmanStrikerImage = getPlayerImage(miniscore.batsmanStriker.batName);
    }

    let bowlerImage;
    if (miniscore?.bowlerStriker?.bowlName) {
      bowlerImage = getPlayerImage(miniscore.bowlerStriker.bowlName);
    }

    const match = (() => {
      const inningsScoreList =
        miniscore?.matchScoreDetails?.inningsScoreList || [];
      const { team1, team2 } = matchHeader;

      // Get list of team IDs that have batted
      const battedTeamIds = inningsScoreList.map((inning) => inning.batTeamId);

      // Add missing innings for teams that haven't batted yet
      const allInnings = [...inningsScoreList];

      // Check and add second innings if needed
      if (allInnings.length < 2) {
        const nextInningsId = allInnings.length + 1;
        const nextBattingTeam = [team1, team2].find(
          (team) => !battedTeamIds.includes(team.id)
        );

        if (nextBattingTeam) {
          allInnings.push({
            inningsId: nextInningsId,
            batTeamId: nextBattingTeam.id,
            batTeamName: nextBattingTeam.shortName,
            score: 0,
            wickets: 0,
            overs: 0,
            isDeclared: false,
            isFollowOn: false,
            ballNbr: 0,
          });
        }
      }

      return allInnings.map((inning) => ({
        ...inning,
        teamImage: getTeamImage(inning.batTeamName),
      }));
    })();

    // Clean the commentary text
    function cleanText(input) {
      return input
        .split(/\s+/) // Split into tokens based on whitespace
        .filter((token) => !token.includes("$")) // Remove tokens containing $
        .filter((token) => !/^B\d+$/.test(token)) // Remove tokens like B0, B1
        .map(
          (token) =>
            token
              .replace(/[\/|]/g, "") // Remove / and | from remaining tokens
              .replace(/\\\w+/g, "") // Remove backslash and any following word characters
        )
        .filter((token) => token !== "") // Remove any resulting empty tokens
        .join(" "); // Join back into a string
    }

    // Generate text-to-speech audio
    let voice;
    const currentComment = cleanText(commentaryList[0].commText);
    console.log(currentComment);
    const matchedPositions = fieldingPositions.filter((position) =>
      currentComment.toLowerCase().includes(position.name)
    );

    const lastObject = matchedPositions.at(-1);
    console.log(matchedPositions);
    const shot = miniscore?.recentOvsStats;

    // Mapping numbers to words
    const numberMap = {
      1: "single",
      2: "double",
      3: "triple",
      4: "four",
      5: "five",
      6: "six",
    };

    // Find the last occurrence of "1" and replace it

    // Remove the repeated text (if the current comment starts with the previous comment)
    let uniqueComment = currentComment;
    if (previousComment && currentComment.startsWith(previousComment)) {
      uniqueComment = currentComment.slice(previousComment.length).trim();
    }

    // If there's no new text, you might want to skip TTS generation
    if (uniqueComment === "") {
      voice = undefined;
    } else {
      try {
        voice = await textToSpeech(uniqueComment);
        // Update previousComment with the full current comment for the next call
        previousComment = currentComment;
      } catch (err) {
        console.error("Error generating voice:", err);
        voice = null; // Fallback in case of an error
      }
    }

    // Construct API response
    const api = {
      status: matchHeader.status,
      toss: matchHeader.tossResults,
      commentary: commentaryList[0].commText,
      partnership: miniscore?.partnerShip ? miniscore?.partnerShip : 0,
      batsmanNonStriker: {
        ...miniscore?.batsmanNonStriker,
        image: batsmanNonStrikerImage,
      },
      batsmanStriker: {
        ...miniscore?.batsmanStriker,
        image: batsmanStrikerImage,
      },
      bowler: {
        ...miniscore?.bowlerStriker,
        image: bowlerImage,
      },
      event: miniscore?.event,
      lastWicket: miniscore?.lastWicket,
      currentRunrate: miniscore?.currentRunRate,
      requiredRunRate: miniscore?.requiredRunRate,
      match,
      recentOvsStats: miniscore?.recentOvsStats,
      voice, // Include the voice file or URL
    };
    const matchs = shot?.match(/(\d)(?!.*\d)/);

    const lastValue = matchs ? numberMap[matchs[1]] || matchs[1] : null;

    console.log(lastValue);
    lastObject;
    if (lastObject && lastValue !== "0") {
      const bowlerImage = getPlayerImage(miniscore?.bowlerStriker?.bowlName);
      const batterImage =
        lastValue == "1"
          ? getPlayerImage(miniscore?.batsmanNonStriker?.batName)
          : getPlayerImage(miniscore?.batsmanStriker?.batName);

      // Trigger amodifiedStringnimation API
      await axios.post("http://localhost:3001/trigger-animation", {
        fieldingPosition: lastObject?.name,
        bowlerImg: bowlerImage?.head,
        batterImg: batterImage?.head,
        shotType: lastValue,
      });
    }
    res.send(api);
  } catch (error) {
    console.log("Error fetching match data:", error);
    res.status(500).send("Error fetching match data");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
