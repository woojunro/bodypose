import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLOR_CHOCOLATE } from '../constants/color';

const { width } = Dimensions.get('window');

const Button = ({ text, ...touchableOpacityProps }) => (
  <TouchableOpacity style={styles.ButtonContainer} {...touchableOpacityProps}>
    <Text style={styles.ButtonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  ButtonContainer: {
    height: 40,
    marginHorizontal: width * 0.05,
    backgroundColor: COLOR_CHOCOLATE,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 3,
    color: 'white',
  },
});

export default Button;
