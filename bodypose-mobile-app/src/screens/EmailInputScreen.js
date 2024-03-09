import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Button from '../components/Button';
import LoadingFullscreen from '../components/LoadingFullscreen';
import TextInput from '../components/TextInput';
import { ERROR_MESSAGE } from '../constants/message';
import { AuthContext } from '../context';
import { isEmailValid } from '../utils/checkValidity';
import { socialLogin } from '../utils/loginFunctions';

const EmailInputScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (!route.params?.provider || !route.params?.accessToken) {
      navigation.goBack();
    }
  }, []);

  useEffect(() => {
    if (!isEmailValid(email)) {
      setErrorMessage('유효한 이메일을 입력해주세요.');
      setCanSubmit(false);
    } else {
      setErrorMessage('');
      setCanSubmit(true);
    }
  }, [email]);

  const onSubmit = async () => {
    if (!canSubmit) {
      return;
    }
    setLoading(true);
    const { provider, accessToken } = route.params;
    const data = { provider, accessToken, email };
    try {
      const res = await socialLogin(data);
      if (res.data.access && res.data.refresh) {
        login();
      } else {
        throw new Error();
      }
    } catch (e) {
      switch (e.response?.data?.message) {
        case 'DUPLICATE_EMAIL':
          setErrorMessage('이미 가입된 이메일입니다.');
          break;
        default:
          setErrorMessage(ERROR_MESSAGE);
      }
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.Container}>
      <TextInput
        label="이메일"
        placeholder="이메일"
        errorMessage={errorMessage}
        textContentType="emailAddress"
        autoCompleteType="email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.ButtonView}>
        <Button text="완료" onPress={onSubmit} />
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
});

export default EmailInputScreen;
