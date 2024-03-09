import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const SocialLoginButton = ({ text, logo, logoWidth, onPress }) => (
  <Pressable style={styles.LoginButtonView} key={text} onPress={onPress}>
    <View style={styles.LoginButtonLogoView}>
      <Image
        style={{
          width: logoWidth,
          ...styles.LoginButtonLogoImage,
        }}
        source={logo}
      />
    </View>
    <View style={styles.LoginButtonTextView}>
      <Text style={styles.LoginButtonText}>{text}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  LoginButtonView: {
    flex: 1,
    flexDirection: 'row',
    width: width * 0.8,
    borderWidth: 0.5,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  LoginButtonLogoView: {
    flex: 3,
    alignItems: 'center',
  },
  LoginButtonLogoImage: {
    resizeMode: 'contain',
  },
  LoginButtonTextView: {
    flex: 17,
    alignItems: 'center',
  },
  LoginButtonText: {
    fontSize: 15,
  },
});

export default SocialLoginButton;
