import React, { useEffect } from 'react';
import { Animated, Easing, StyleSheet, View, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const App = () => {
  const waveAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      { resetBeforeIteration: false }
    ).start();
  }, []);

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
          <Animated.Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png',
            }}
            style={[styles.flag, { transform: [{ skewX: getSkewX() }] }]}
            resizeMode="cover"
          />
          <View>
            <Text style={styles.text}>IND</Text>
            <Text style={styles.scoreText}>232-3</Text>
            <Text style={styles.overText}>Over: 32.1</Text>
          </View>
          <View style={{ width: '20%' }}></View>
          <View>
            <Text style={styles.text}>ENG</Text>
            <Text style={styles.scoreText}>232-3</Text>
            <Text style={styles.overText}>Over: 32.1</Text>
          </View>
          <Animated.Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png',
            }}
            style={[styles.flag, { transform: [{ skewX: getSkewX(true) }] }]}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>

      <LinearGradient colors={['#0f2027', '#203a43']} style={[styles.box, { flex: 0.5 }]}>
        <Text style={styles.text}>Hello</Text>
      </LinearGradient>

      <LinearGradient colors={['#3e0000', '#7a0000']} style={[styles.box, { flex: 2 }]}>
        <Text style={styles.text}>Hello</Text>
      </LinearGradient>

      <LinearGradient colors={['#2a0a3d', '#531d8a']} style={[styles.box, { flex: 1 }]}>
        <Text style={styles.text}>Hello</Text>
      </LinearGradient>

      <LinearGradient colors={['#434343', '#000000']} style={[styles.box, { flex: 0.5 }]}>
        <Text style={styles.text}>Hello</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    
    backgroundColor: 'black',
  },
  box: {
    marginVertical: 5,
    width: '100%',
  },
  flagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 40,
    alignItems: 'center',
  },
  flag: {
    width: 280,
    height: 180,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: 'white',
  },
  text: {
    fontFamily: 'mudstone',
    color: 'white',
    fontSize: 72,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 64,
    color: 'yellow',
    fontWeight: 'bold',
  },
  overText: {
    fontSize: 48,
    color: 'lightgray',
  },
});

export default App;
