import React from 'react';
import { 
  Animated, 
  StyleSheet, 
  View, 
  Text, 
  Dimensions,
  PixelRatio 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scaleFont = size => {
  const scaleFactor = PixelRatio.getFontScale();
  return PixelRatio.roundToNearestPixel(size * Math.min(width / 375, height / 667) * scaleFactor);
};

const scaleSize = size => PixelRatio.roundToNearestPixel(size * (width / 375));
const scaleHorizontal = size => PixelRatio.roundToNearestPixel(size * (width / 375));
const scaleVertical = size => PixelRatio.roundToNearestPixel(size * (height / 667));

// Flag aspect ratio (3:2)
const FLAG_ASPECT_RATIO = 3/2;

const App = () => {
  return (
    <View style={styles.container}>
      {/* Top Section - Match Status */}
      <LinearGradient
        colors={['#000000', '#434343']}
        style={[styles.box, { flex: 0.3 * (height / 667) }]}>
        <View style={styles.flagContainer}>
          <Animated.Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg' }}
            style={[
              styles.flag, 
              { 
                width: width * 0.25,
                height: (width * 0.25) / FLAG_ASPECT_RATIO,
                borderWidth: scaleSize(2),
                borderRadius: scaleSize(4)
              }
            ]}
            resizeMode="cover"
          />
          
          <View style={styles.scoreContainer}>
            <Text style={[styles.teamName, { fontSize: scaleFont(32) }]}>IND</Text>
            <Text style={[styles.score, { fontSize: scaleFont(42) }]}>232-3</Text>
            <Text style={[styles.over, { fontSize: scaleFont(32) }]}>Over: 32.1</Text>
          </View>

          <View style={[
            styles.progressContainer,
            { 
              width: scaleHorizontal(40),
              borderRadius: scaleSize(30),
              borderWidth: scaleSize(3),
              marginTop: scaleVertical(20)
            }
          ]}>
            <View style={styles.progressBar} />
          </View>

          <View style={styles.scoreContainer}>
            <Text style={[styles.teamName, { fontSize: scaleFont(32) }]}>ENG</Text>
            <Text style={[styles.score, { fontSize: scaleFont(42) }]}>232-3</Text>
            <Text style={[styles.over, { fontSize: scaleFont(32) }]}>Over: 32.1</Text>
          </View>

          <Animated.Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_(1-2).svg' }}
            style={[
              styles.flag, 
              { 
                width: width * 0.25,
                height: (width * 0.25) / FLAG_ASPECT_RATIO,
                borderWidth: scaleSize(2),
                borderRadius: scaleSize(4)
              }
            ]}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>

      {/* Stats Bar */}
      <LinearGradient
        colors={['#0f2027', '#203a43']}
        style={[styles.box, { flex: 0.1 * (height / 667) }]}>
        <Text style={[styles.statsText, { fontSize: scaleFont(28) }]}>
          Partnership: 72(52)  |  Last 5 Ov: 54/0
        </Text>
      </LinearGradient>

      {/* Main Content Area */}
      <LinearGradient
        colors={['#3e0000', '#7a0000']}
        style={[styles.box, { flex: 0.4 * (height / 667) }]}>
        <View style={styles.backgroundContainer}>
          <Animated.Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Wankhede_ICC_WCF.jpg' }}
            style={[
              styles.backgroundImage,
              { 
                width: width - scaleHorizontal(16),
                height: height * 0.4,
                borderRadius: scaleSize(8)
              }
            ]}
            resizeMode="cover"
          />
        </View>
        <View style={styles.overlayContent}>
          <Text style={[styles.stadiumText, { fontSize: scaleFont(36) }]}>
            Wankhede Stadium
          </Text>
        </View>
      </LinearGradient>

      {/* Player Stats */}
      <LinearGradient
        colors={['#2a0a3d', '#531d8a']}
        style={[styles.box, { flex: 0.15 * (height / 667) }]}>
        <View style={styles.playerStats}>
          <Text style={[styles.statItem, { fontSize: scaleFont(26) }]}>Kohli: 78*(45)</Text>
          <Text style={[styles.statItem, { fontSize: scaleFont(26) }]}>Strike Rate: 173.3</Text>
          <Text style={[styles.statItem, { fontSize: scaleFont(26) }]}>4s/6s: 8/4</Text>
        </View>
      </LinearGradient>

      {/* Bottom Bar */}
      <LinearGradient
        colors={['#434343', '#000000']}
        style={[styles.box, { flex: 0.05 * (height / 667) }]}>
        <View style={styles.bottomBar}>
          <Text style={[styles.bottomText, { fontSize: scaleFont(24) }]}>
            IND won toss | Need 38 in 67 | CRR:7.83
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: scaleVertical(8),
    paddingHorizontal: scaleHorizontal(8),
  },
  box: {
    borderRadius: scaleSize(12),
    marginVertical: scaleVertical(4),
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
    padding: scaleSize(16),
  },
  stadiumText: {
    color: 'white',
    fontFamily: 'mudstone',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleHorizontal(16),
  },
  bottomText: {
    color: 'white',
    fontFamily: 'mudstone',
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