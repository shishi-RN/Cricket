import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GoldenBorderBox = ({ children }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.border, { transform: [{ rotate: rotateInterpolation }] }]}>
        <LinearGradient
          colors={['#FFD700', '#D4AF37', '#FFD700']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  border: {
    position: 'absolute',
    width: '150%',
    height: '150%',
  },
  gradient: {
    flex: 1,
  },
  content: {
    width: '92%',
    height: '92%',
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GoldenBorderBox;