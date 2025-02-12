const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Fuse = require("fuse.js");
const app = express();
app.use(cors());
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
      "https://www.cricbuzz.com/api/cricket-match/commentary/100328"
    );
    const { matchHeader, commentaryList, miniscore } = response.data;

    // Retrieve player images using fuzzy matching
    const batsmanNonStrikerImage = getPlayerImage(
      miniscore.batsmanNonStriker.batName
    );
    const batsmanStrikerImage = getPlayerImage(
      miniscore.batsmanStriker.batName
    );
    const bowlerImage = getPlayerImage(miniscore.bowlerStriker.bowlName);
    const match = miniscore.matchScoreDetails.inningsScoreList.map((inning) => ({
      ...inning,
      teamImage: getPlayerImage(inning.batTeamName),
    }));
    console.log(match)
    const api = {
      status: matchHeader.status,
      toss: matchHeader.tossResults,
      commentary: commentaryList[0].commText,
      partnership: miniscore.partnerShip,
      batsmanNonStriker: {
        ...miniscore.batsmanNonStriker,
        image: batsmanNonStrikerImage,
      },
      batsmanStriker: {
        ...miniscore.batsmanStriker,
        image: batsmanStrikerImage,
      },
      bowler: {
        ...miniscore.bowlerStriker,
        image: bowlerImage,
      },
      event: miniscore.event,
      lastWicket: miniscore.lastWicket,
     match,
     recentOvsStats:miniscore.recentOvsStats
    };

    res.send(api);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
