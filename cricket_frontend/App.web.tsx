import React, {useEffect} from 'react';
import {Animated, Easing, StyleSheet, View, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const App = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#434343']}
        style={[styles.box, {flex: 1.1}]}>
        <View style={styles.flagContainer}>
          {/* Flag 1 */}
          <Animated.Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png',
            }}
            style={[styles.flag]}
            resizeMode="cover"
          />
          <View>
            <Text
              style={{color: 'white', fontFamily: 'mudstone', fontSize: 38}}>
              IND
            </Text>
            <Text style={{color: 'white', fontFamily: 'lean', fontSize: 48}}>
              232-3
            </Text>
            <Text style={{color: 'yellow', fontFamily: 'lean', fontSize: 38}}>
              Over: 32.1
            </Text>
          </View>
          <View
            style={{
              width: '40%',
              backgroundColor: 'black',
              borderRadius: 30,
              justifyContent: 'center',
              marginTop: 20,
              borderWidth: 3,
              borderColor: 'yellow',
            }}></View>
          <View>
            <Text
              style={{color: 'white', fontFamily: 'mudstone', fontSize: 38}}>
              IND
            </Text>
            <Text style={{color: 'white', fontFamily: 'lean', fontSize: 48}}>
              232-3
            </Text>
            <Text style={{color: 'yellow', fontFamily: 'lean', fontSize: 38}}>
              Over: 32.1
            </Text>
          </View>
          {/* Flag 2 */}
          <Animated.Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png',
            }}
            style={[styles.flag]}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>
      {/* 2nd view: Darker gradient (darker blue) */}
      <LinearGradient
        colors={['#0f2027', '#203a43']}
        style={[styles.box, {flex: 0.2}]}>
        <Text style={styles.text}>Hello</Text>
      </LinearGradient>

      {/* 3rd view: Darker gradient (dark red) */}
      {/* 3rd view: Darker gradient (dark red) */}
      <LinearGradient
        colors={['#3e0000', '#7a0000']}
        style={[styles.box, {flex: 2}]}>
        <View style={styles.backgroundContainer}>
          <Animated.Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Wankhede_ICC_WCF.jpg',
            }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.overlayContent}>
          <Text style={styles.text}>Hello</Text>
        </View>
      </LinearGradient>

      {/* 4th view: Darker gradient (dark purple) */}
      <LinearGradient
        colors={['#2a0a3d', '#531d8a']}
        style={[styles.box, {flex: 1}]}>
        <Text style={styles.text}>Hello</Text>
      </LinearGradient>

      {/* 5th view: Variant of black (reversed gradient) */}
      <LinearGradient
        colors={['#434343', '#000000']}
        style={[styles.box, {flex: 0.5}]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 25,

            marginTop: 15,
          }}>
          <Text style={{color: 'white', fontFamily: 'lean', fontSize: 38}}>
            IND won the toss and elected to bat
          </Text>
          <Text style={{color: 'white', fontFamily: 'mudstone', fontSize: 38}}>
            IND need 38 runs in 67 balls
          </Text>
          <Text style={{color: 'white', fontFamily: 'mudstone', fontSize: 38}}>
            CRR:7.83 RRR:5.86
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
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject, // Ensures full stretch
    zIndex: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlayContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensures text stays above the background
  },
  box: {
    marginVertical: 2,
    marginHorizontal: 8,
  },
  circleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  flagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  flag: {
    width: 190,
    height: 120,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
  },
  text: {
    fontFamily: 'mudstone',
    color: 'white',
    fontSize: 38,
  },
});

export default App;
