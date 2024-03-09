import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const LoadingFullscreen = () => (
  <View style={styles.Loading}>
    <ActivityIndicator />
  </View>
);

const styles = StyleSheet.create({
  Loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingFullscreen;
