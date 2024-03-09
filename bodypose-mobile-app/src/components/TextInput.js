import React from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  COLOR_CHOCOLATE,
  COLOR_ERROR_RED,
  COLOR_GRAY,
} from '../constants/color';

const { width } = Dimensions.get('window');

const CustomTextInput = ({
  label,
  placeholder,
  errorMessage = '',
  ...textInputProps
}) => (
  <View style={styles.View}>
    <Text style={styles.Label}>{label}</Text>
    <TextInput
      style={styles.Input}
      placeholder={placeholder}
      placeholderTextColor={COLOR_GRAY}
      {...textInputProps}
    />
    {errorMessage !== null && (
      <Text style={styles.ErrorMessage}>{errorMessage}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  View: {
    marginTop: 30,
    marginHorizontal: width * 0.05,
  },
  Label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR_CHOCOLATE,
  },
  Input: {
    marginVertical: 10,
    paddingVertical: 5,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_GRAY,
  },
  ErrorMessage: {
    color: COLOR_ERROR_RED,
  },
});

export default CustomTextInput;
