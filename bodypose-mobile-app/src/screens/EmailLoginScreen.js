import React, { useContext, useState } from 'react';
import {
  Dimensions,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from '../components/Button';
import LoadingFullscreen from '../components/LoadingFullscreen';
import TextInput from '../components/TextInput';
import { BASE_URL } from '../constants/url';
import { AuthContext } from '../context';
import { isEmailValid, isPasswordValid } from '../utils/checkValidity';
import { loginWithEmail } from '../utils/loginFunctions';

const { width } = Dimensions.get('window');

const EmailLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setLoading(true);
    if (!isEmailValid(email) || !isPasswordValid(password)) {
      setErrorMessage('이메일 혹은 비밀번호를 다시 한 번 확인해주세요.');
      setLoading(false);
      return;
    }
    const result = await loginWithEmail(email, password);
    if (result.success) {
      login();
      return;
    } else {
      if (result.errorMessage === 'DEFAULT') {
        setErrorMessage('이메일 혹은 비밀번호를 다시 한 번 확인해주세요.');
      } else {
        setErrorMessage(result.errorMessage);
      }
    }
    setLoading(false);
  };

  const openPasswordResetLink = () => {
    Linking.openURL(`${BASE_URL}/changePassword`);
  };

  return (
    <SafeAreaView style={styles.Container}>
      <TextInput
        label="이메일"
        placeholder="이메일"
        errorMessage={null}
        textContentType="emailAddress"
        autoCompleteType="email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        label="비밀번호"
        placeholder="비밀번호"
        errorMessage={errorMessage}
        secureTextEntry
        textContentType="password"
        autoCompleteType="password"
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.ButtonView}>
        <Button text="로그인" onPress={handleLogin} />
      </View>
      <View style={styles.ForgotPasswordView}>
        <Text style={styles.ForgotPasswordText} onPress={openPasswordResetLink}>
          비밀번호가 기억나지 않아요
        </Text>
      </View>
      {loading && <LoadingFullscreen />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  ButtonView: {
    marginTop: 20,
  },
  ForgotPasswordView: {
    marginVertical: 10,
    marginLeft: 'auto',
    marginRight: width * 0.05,
  },
  ForgotPasswordText: {
    color: '#555555',
    textDecorationLine: 'underline',
  },
});

export default EmailLoginScreen;
