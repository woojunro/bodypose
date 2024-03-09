import axios from 'axios';
import { API_URL } from '../constants/url';
import { login } from '@react-native-seoul/kakao-login';
import { NaverLogin } from '@react-native-seoul/naver-login';
import {
  NAVER_LOGIN_ANDROID_KEYS,
  NAVER_LOGIN_IOS_KEYS,
} from '../constants/naverLogin';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_LOGIN_WEBCLIENT_ID } from '../constants/googleLogin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { USER_LOCKED_MESSAGE } from '../constants/message';

export const socialLogin = data => {
  const url = `${API_URL}/auth/login/oauth`;
  return axios.post(url, data);
};

export const loginWithKakao = async () => {
  const token = await login();
  return token.accessToken;
};

export const loginWithNaver = async os => {
  const initials =
    os === 'ios' ? NAVER_LOGIN_IOS_KEYS : NAVER_LOGIN_ANDROID_KEYS;
  return new Promise((resolve, reject) => {
    NaverLogin.login(initials, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res.accessToken);
    });
  });
};

export const loginWithGoogle = async () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_LOGIN_WEBCLIENT_ID,
  });
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo.idToken;
};

export const loginWithApple = async () => {
  const response = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL],
  });
  return response.authorizationCode;
};

export const loginWithEmail = async (email, password) => {
  const ret = { success: false, errorMessage: '' };
  const url = `${API_URL}/auth/login/email`;
  const data = { email, password };
  axios.defaults.withCredentials = true;
  try {
    const res = await axios.post(url, data);
    if (res.data.access && res.data.refresh) {
      ret.success = true;
      ret.errorMessage = null;
    } else {
      ret.success = false;
      ret.errorMessage = 'DEFAULT';
    }
    return ret;
  } catch (e) {
    switch (e.response?.data?.message) {
      case 'USER_NOT_FOUND':
        ret.errorMessage = '가입되지 않은 이메일입니다.';
        break;
      case 'SOCIAL_USER':
        ret.errorMessage =
          '소셜 로그인 회원입니다. 소셜 로그인을 진행해주세요.';
        break;
      case 'WRONG_PASSWORD':
        ret.errorMessage = '비밀번호가 일치하지 않습니다.';
        break;
      case 'USER_LOCKED':
        ret.errorMessage = USER_LOCKED_MESSAGE;
        break;
      default:
        ret.errorMessage = 'DEFAULT';
        break;
    }
    return ret;
  }
};
