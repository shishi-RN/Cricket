const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Fuse = require("fuse.js");
const textToSpeech = require("./play");
const path = require("path");
const app = express();
app.use(cors());
app.use("/voices", express.static(path.join(__dirname, "public", "voices")));
const images = [
  {
    name: "IND",
    image: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg",
  },
  {
    name: "ENG",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_(1-2).svg",
  },
  {
    name:"ZIM",
    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Zimbabwe.svg/1200px-Flag_of_Zimbabwe.svg.png"
  },
  {
    name:"IRE",
    image:"https://upload.wikimedia.org/wikipedia/commons/4/45/Flag_of_Ireland.svg"
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
    name: "PAK",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Pakistan.svg/800px-Flag_of_Pakistan.svg.png",
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

function getPlayerImage(playerName) {
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

app.get("/match-data", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.cricbuzz.com/api/cricket-match/commentary/112479"
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

    const match =
      miniscore?.matchScoreDetails?.inningsScoreList?.map((inning) => ({
        ...inning,
        teamImage: inning.batTeamName
          ? getPlayerImage(inning.batTeamName)
          : undefined,
      })) ?? [];

    // Clean the commentary text

    function cleanText(input) {
      return input
        .split(/\s+/) // Split into tokens based on whitespace
        .filter((token) => !token.includes("$")) // Remove tokens containing $
        .filter((token) => !/^B\d+$/.test(token)) // Remove tokens like B0, B1
        .map((token) =>
          token
            .replace(/[\/|]/g, "") // Remove / and | from remaining tokens
            .replace(/\\\w+/g, "") // Remove backslash and any following word characters
        )
        .filter((token) => token !== "") // Remove any resulting empty tokens
        .join(" "); // Join back into a string
    }
    // Generate text-to-speech audio
    let voice;
    try {
      voice = await textToSpeech(cleanText(commentaryList[0].commText));
    } catch (err) {
      console.error("Error generating voice:", err);
      voice = null; // Fallback in case of an error
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
      match,
      recentOvsStats: miniscore?.recentOvsStats,
      voice, // Include the voice file or URL
    };

    res.send(api);
  } catch (error) {
    console.log("Error fetching match data:", error);
    res.status(500).send("Error fetching match data");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
