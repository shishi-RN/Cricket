import React, {useEffect} from 'react';
import {Animated, Easing, StyleSheet, View, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const App = () => {
  // Create an animated value
  const waveAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      {resetBeforeIteration: false}, // Prevents a reset gap between iterations
    ).start();
  }, []);

  // Interpolate the animated value to produce a continuous wave
  const getSkewX = (reverse = false) =>
    waveAnim.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: reverse
        ? ['0deg', '-15deg', '0deg', '15deg', '0deg']
        : ['0deg', '15deg', '0deg', '-15deg', '0deg'],
    });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000000', '#434343']} style={styles.box}>
        <View style={styles.flagContainer}>
          {/* Flag 1 */}
          <Animated.Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png',
            }}
            style={[styles.flag, {transform: [{skewX: getSkewX()}]}]}
            resizeMode="cover"
          />
          <View>
            <Text style={{color: 'white', fontFamily: 'mudstone'}}>IND</Text>
            <Text>232-3</Text>
            <Text>Over: 32.1</Text>
          </View>
          <View style={{width: '20%'}}></View>
          <View>
            <Text>IND</Text>
            <Text>232-3</Text>
            <Text>Over: 32.1</Text>
          </View>
          {/* Flag 2 */}
          <Animated.Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png',
            }}
            style={[styles.flag, {transform: [{skewX: getSkewX(true)}]}]}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>
      {/* 2nd view: Darker gradient (darker blue) */}
      <LinearGradient
        colors={['#0f2027', '#203a43']}
        style={[styles.box, {flex: 0.5}]}>
        <Text style={styles.text}>Hello</Text>
      </LinearGradient>

      {/* 3rd view: Darker gradient (dark red) */}
      <LinearGradient
        colors={['#3e0000', '#7a0000']}
        style={[styles.box, {flex: 2}]}>
        <Text style={styles.text}>Hello</Text>
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
        <Text style={styles.text}>Hello</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    marginVertical: 2,
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
    width: 140,
    height: 90,
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
