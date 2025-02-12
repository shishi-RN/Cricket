import React, {useEffect, useState, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  Dimensions,
  PixelRatio,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

const {width, height} = Dimensions.get('window');

// Responsive scaling functions
const scaleFont = size => {
  const scaleFactor = PixelRatio.getFontScale();
  return PixelRatio.roundToNearestPixel(
    size * Math.min(width / 375, height / 667) * scaleFactor,
  );
};

const scaleSize = size => PixelRatio.roundToNearestPixel(size * (width / 375));
const scaleHorizontal = size =>
  PixelRatio.roundToNearestPixel(size * (width / 375));
const scaleVertical = size =>
  PixelRatio.roundToNearestPixel(size * (height / 667));

const FLAG_ASPECT_RATIO = 3 / 2;

const App = () => {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 2000, // Rotation duration in milliseconds
        useNativeDriver: true,
      }),
    ).start();
  }, [rotationAnim]);

  const apiData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/match-data');
      console.log(response.data, 'heereee');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiData();
        setMatchData(data);
        setLoading(false);

        // Start the fade-in animation after data is loaded
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    // Fetch data immediately on component mount
    fetchData();

    // Set up interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fadeAnim]);

  const indInnings = matchData?.match?.find(m => m.batTeamName === 'IND');
  const engInnings = matchData?.match?.find(m => m.batTeamName === 'ENG');
  const partnershipText = `${matchData?.partnership?.runs ?? "0"}(${matchData?.partnership?.balls ?? "0"})`;

 
  const tossText = `${matchData?.toss.tossWinnerName} won toss & chose ${matchData?.toss.decision}`;
  const striker = matchData?.batsmanStriker;
  const nonStriker = matchData?.batsmanNonStriker;
  const bowler = matchData?.bowler;
  const strikerText = `${striker?.batName ?? "0"}: ${striker?.batRuns ?? "0"}(${striker?.batBalls ?? "0"})`;
  const nonStrikeText = `${nonStriker?.batName ?? "0"}: ${nonStriker?.batRuns ?? "0"}(${nonStriker?.batBalls ?? "0"})`;
  const strikeRateText = `Strike Rate: ${(striker?.batStrikeRate ?? 0).toFixed(2)}`;
  const foursSixesText = `4s/6s: ${striker?.batFours ?? "0"}/${striker?.batSixes ?? "0"}`;
  const nonstrikeRateText = `Strike Rate: ${(nonStriker?.batStrikeRate ?? 0).toFixed(2)}`;
  const nonfoursSixesText = `4s/6s: ${nonStriker?.batFours ?? "0"}/${nonStriker?.batSixes ?? "0"}`;
  const bowlerRate = `Overs: ${bowler?.bowlOvs ?? "0"} Runs: ${bowler?.bowlRuns ?? "0"} Wickets: ${bowler?.bowlWkts ?? "0"} Economy: ${bowler?.bowlEcon ?? "0"}`;
  const lastValue = matchData?.recentOvsStats?.trim().split(" ").pop();
  return (
    <View style={styles.container}>
      {/* Top Section - Match Status */}
      <LinearGradient
        colors={['#000000', '#434343']}
        style={[styles.box, {flex: 0.3 * (height / 667)}]}>
        <View style={styles.flagContainer}>
          <Animated.Image
            source={{
              uri:
                indInnings?.teamImage ??
                'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg',
            }}
            style={[
              styles.flag,
              {
                width: width * 0.15,
                height: (width * 0.2) / FLAG_ASPECT_RATIO,
                borderWidth: scaleSize(2),
                borderRadius: scaleSize(4),
              },
            ]}
            resizeMode="cover"
          />

          <View style={styles.scoreContainer}>
            <Animated.Text
              style={[
                styles.teamName,
                {fontSize: scaleFont(32), opacity: fadeAnim},
              ]}>
              {indInnings?.batTeamName ?? 'IND'}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.score,
                {fontSize: scaleFont(42), opacity: fadeAnim},
              ]}>
              {indInnings?.score ?? 0}/{indInnings?.wickets ?? 0}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.over,
                {fontSize: scaleFont(32), opacity: fadeAnim},
              ]}>
              Over: {indInnings?.overs ?? 0.0}
            </Animated.Text>
          </View>

          <View
            style={[
              styles.progressContainer,
              {
                width: scaleHorizontal(60),
                borderRadius: scaleSize(30),
                borderWidth: scaleSize(1),
                marginTop: scaleVertical(20),
              },
            ]}>
            <Animated.Text
              style={[
                styles.teamName,
                {
                  fontSize:matchData?.event  === "NONE" ? scaleFont(15): scaleFont(25),
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignContent:"center",
                  opacity: rotationAnim,
                },
              ]}>
              {matchData?.event  === "NONE" ? lastValue :matchData?.event ?? 'BALL'}
            </Animated.Text>
            {/* <View style={styles.progressBar} /> */}
          </View>

          <View style={styles.scoreContainer}>
            <Animated.Text
              style={[
                styles.teamName,
                {fontSize: scaleFont(32), opacity: fadeAnim},
              ]}>
              {engInnings?.batTeamName ? engInnings?.batTeamName : 'ENG'}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.score,
                {fontSize: scaleFont(42), opacity: fadeAnim},
              ]}>
              {engInnings?.score ?? 0}/{engInnings?.wickets ?? 0}
            </Animated.Text>

            <Animated.Text
              style={[
                styles.over,
                {fontSize: scaleFont(32), opacity: fadeAnim},
              ]}>
              Over: {engInnings?.overs ?? 0.0}
            </Animated.Text>
          </View>

          <Animated.Image
            source={{
              uri:
                engInnings?.teamImage ??
                'https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_(1-2).svg',
            }}
            style={[
              styles.flag,
              {
                width: width * 0.15,
                height: (width * 0.2) / FLAG_ASPECT_RATIO,
                borderWidth: scaleSize(2),
                borderRadius: scaleSize(4),
              },
            ]}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>

      {/* Stats Bar */}
      <LinearGradient
        colors={['#0f2027', '#203a43']}
        style={[styles.box, {flex: 0.1 * (height / 667)}]}>
        <Text
          style={[
            styles.statsText,
            {fontSize: scaleFont(20), marginTop: scaleFont(19)},
          ]}>
          Partnership: {partnershipText?? "00"} | Last 5 Ov:{' '}
          {matchData?.recentOvsStats ?? "0"}
        </Text>
      </LinearGradient>

      {/* Main Content Area */}
      <LinearGradient
        colors={['#3e0000', '#7a0000']}
        style={[styles.box, {flex: 0.4 * (height / 667)}]}>
        <View style={styles.backgroundContainer}>
          <Animated.Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Wankhede_ICC_WCF.jpg',
            }}
            style={[
              styles.backgroundImage,
              {
                width: width,
                height: height * 0.4,
                borderRadius: scaleSize(8),
              },
            ]}
            resizeMode="cover"
          />
        </View>
        <View style={styles.overlayContent}>
          {/* <Text style={[styles.stadiumText, {fontSize: scaleFont(36)}]}>
            Wankhede Stadium
          </Text> */}
        </View>
      </LinearGradient>

      {/* Player Stats */}
      <LinearGradient
        colors={['#2a0a3d', '#531d8a']}
        style={[styles.box, {flex: 0.2 * (height / 667)}]}>
        <View style={styles.playerStats}>
          <Text style={[styles.statItem, {fontSize: scaleFont(26)}]}>
            {strikerText}
          </Text>
          <Text style={[styles.statItem, {fontSize: scaleFont(26)}]}>
            {strikeRateText}
          </Text>
          <Text style={[styles.statItem, {fontSize: scaleFont(26)}]}>
            {foursSixesText}
          </Text>
        </View>
        <View style={styles.playerStats}>
          <Text style={[styles.statItem, {fontSize: scaleFont(26)}]}>
            {nonStrikeText}
          </Text>
          <Text style={[styles.statItem, {fontSize: scaleFont(26)}]}>
            {nonstrikeRateText}
          </Text>
          <Text style={[styles.statItem, {fontSize: scaleFont(26)}]}>
            {nonfoursSixesText}
          </Text>
        </View>
        <View style={styles.playerStats}>
          <Text style={[styles.statItem, {fontSize: scaleFont(26)}]}>
            {bowler?.bowlName}
          </Text>
          <Text style={[styles.statItem, {fontSize: scaleFont(26)}]}>
            {bowlerRate}
          </Text>
        </View>
      </LinearGradient>

      {/* Bottom Bar */}
      <LinearGradient
        colors={['#434343', '#000000']}
        style={[styles.box, {flex: 0.2 * (height / 667)}]}>
        <View style={styles.bottomBar}>
          <Text style={[styles.bottomText, {fontSize: scaleFont(24)}]}>
            {`${tossText} \n LW: ${matchData?.lastWicket?? "0"} \n ${matchData?.status}`}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flag: {
    overflow: 'hidden',
    borderColor: 'white',
  },
  box: {
    marginVertical: scaleVertical(2),
    overflow: 'hidden',
  },
  flagContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleHorizontal(8),
  },
  scoreContainer: {
    minWidth: width * 0.2,
    alignItems: 'center',
    marginHorizontal: scaleHorizontal(4),
  },
  teamName: {
    color: 'white',
    fontFamily: 'mudstone',
    marginBottom: scaleVertical(4),
  },
  score: {
    color: 'white',
    fontFamily: 'lean',
    marginBottom: scaleVertical(4),
  },
  over: {
    color: 'yellow',
    fontFamily: 'lean',
  },
  progressContainer: {
    height: '60%',
    backgroundColor: 'black',
    justifyContent: 'center',
    borderColor: 'yellow',
  },
  progressBar: {
    height: '70%',
    backgroundColor: 'yellow',
    marginHorizontal: scaleHorizontal(2),
    borderRadius: scaleSize(25),
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  backgroundImage: {
    opacity: 0.8,
  },
  overlayContent: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: 'flex-end',
  },
  stadiumText: {
    color: 'white',
    fontFamily: 'mudstone',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  playerStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: scaleHorizontal(16),
  },
  statItem: {
    color: 'white',
    fontFamily: 'lean',
    textAlign: 'center',
  },
  bottomBar: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: scaleHorizontal(16),
  },
  bottomText: {
    color: 'white',
    fontFamily: 'lean',
    textAlign: 'center',
  },
  statsText: {
    color: 'white',
    fontFamily: 'lean',
    textAlign: 'center',
    flex: 1,
    textAlignVertical: 'center',
  },
});

export default App;
