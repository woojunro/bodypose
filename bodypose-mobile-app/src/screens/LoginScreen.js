import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import LoadingFullscreen from '../components/LoadingFullscreen';
import SocialLoginButton from '../components/SocialLoginButton';
import { COLOR_CHOCOLATE } from '../constants/color';
import { PRIVACY_NOTICE_ID, TEMRS_NOTICE_ID } from '../constants/documents';
import { USER_LOCKED_MESSAGE } from '../constants/message';
import { AuthContext } from '../context';
import { alertError } from '../utils/displayMessage';
import {
  loginWithApple,
  loginWithGoogle,
  loginWithKakao,
  loginWithNaver,
  socialLogin,
} from '../utils/loginFunctions';

const loginMethods = [
  {
    text: '카카오 계정으로 로그인',
    logo: require('../assets/kakaotalk.png'),
    provider: 'KAKAO',
    imageWidth: '50%',
  },
  {
    text: '네이버 아이디로 로그인',
    logo: require('../assets/naver.png'),
    provider: 'NAVER',
    imageWidth: '50%',
  },
  {
    text: 'Google 계정으로 로그인',
    logo: require('../assets/google.png'),
    provider: 'GOOGLE',
    imageWidth: '70%',
  },
  {
    text: 'Apple로 계속하기',
    logo: require('../assets/apple.png'),
    provider: 'APPLE',
    imageWidth: '50%',
  },
  {
    text: '이메일로 로그인하기',
    logo: require('../assets/mail.png'),
    provider: 'EMAIL',
    imageWidth: '50%',
  },
];

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { login: appLogin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const login = async provider => {
    setLoading(true);
    let accessToken = '';
    try {
      switch (provider) {
        case 'EMAIL':
          setLoading(false);
          goToEmailLoginScreen();
          return;
        case 'KAKAO':
          accessToken = await loginWithKakao();
          break;
        case 'NAVER':
          accessToken = await loginWithNaver(Platform.OS);
          break;
        case 'GOOGLE':
          accessToken = await loginWithGoogle();
          break;
        case 'APPLE':
          accessToken = await loginWithApple();
          break;
        default:
          throw new Error();
      }
      const data = {
        provider,
        accessToken,
      };
      try {
        const res = await socialLogin(data);
        if (res.data.access && res.data.refresh) {
          appLogin();
        } else {
          throw new Error();
        }
      } catch (e) {
        switch (e.response?.data?.message) {
          case 'EMAIL_NOT_FOUND':
            navigation.navigate('이메일 입력', { provider, accessToken });
            setLoading(false);
            break;
          case 'USER_LOCKED':
            alertError(USER_LOCKED_MESSAGE);
            setLoading(false);
            break;
          default:
            throw new Error();
        }
      }
    } catch (e) {
      alertError('소셜 로그인 중 오류가 발생하였습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  const goToEmailLoginScreen = () => {
    navigation.navigate('이메일로 로그인');
  };

  const goToNoticeScreen = id => {
    navigation.navigate('공지', { id });
  };

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.LogoView}>
        <Image
          style={styles.LogoImage}
          source={require('../assets/bodypose-logo-symbol.png')}
        />
      </View>
      <View style={styles.LoginButtonsView}>
        {loginMethods.map(
          method =>
            (Platform.OS === 'ios' || method.provider !== 'APPLE') && (
              <SocialLoginButton
                key={method.provider}
                text={method.text}
                logo={method.logo}
                logoWidth={method.imageWidth}
                onPress={() => login(method.provider)}
              />
            ),
        )}
        <Text style={styles.AgreementText}>
          소셜 로그인 시{' '}
          <Text
            style={styles.UnderlinedText}
            onPress={() => goToNoticeScreen(TEMRS_NOTICE_ID)}>
            이용약관
          </Text>
          ,{' '}
          <Text
            style={styles.UnderlinedText}
            onPress={() => goToNoticeScreen(PRIVACY_NOTICE_ID)}>
            개인정보처리방침
          </Text>
          에 동의한 것으로 간주합니다.
        </Text>
      </View>
      <View style={styles.EmailRegisterView}>
        <Pressable
          style={styles.EmailRegisterTouchable}
          onPress={() =>
            Linking.openURL('https://bodypose.co.kr/startWithEmail')
          }>
          <Text>바디포즈 계정이 없으신가요?</Text>
          <Text style={styles.UnderlinedText}>이메일로 시작하기</Text>
        </Pressable>
      </View>
      {loading && <LoadingFullscreen />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  LogoView: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LogoImage: {
    width: width * 0.7,
    resizeMode: 'contain',
  },
  LoginButtonsView: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '20%',
  },
  AgreementText: {
    marginTop: 20,
    fontSize: 10,
  },
  EmailRegisterView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  EmailRegisterTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  UnderlinedText: {
    color: COLOR_CHOCOLATE,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
