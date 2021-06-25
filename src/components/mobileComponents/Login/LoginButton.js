import React, { useState } from 'react';
import axios from 'axios';
import './LoginButton.css';
import { BASE_URL } from '../../../constants/urls';
import { CheckValidEmail } from '../../functions/Login/LoginFunctions';
import { IsLoggedInVar } from '../../../apollo';

const LoginButton = ({ email, password, setValidInfo, setErrorMessage }) => {
  const [loading, setLoading] = useState(false);

  const emailLogin = async (email, password) => {
    setLoading(true);
    setValidInfo(true);

    if (!CheckValidEmail(email)) {
      setValidInfo(false);
      setErrorMessage('이메일을 정확하게 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const url = `${BASE_URL}/auth/login/email`;
      const payload = { email, password };
      axios.defaults.withCredentials = true;
      const res = await axios.post(url, payload);
      if (res.data.access && res.data.refresh) {
        IsLoggedInVar(true);
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message;
      let message = '';
      switch (errorMessage) {
        case 'USER_NOT_FOUND':
          message = '등록되지 않은 이메일입니다.';
          break;
        case 'SOCIAL_USER':
          message = '소셜 회원입니다. 소셜 로그인을 진행해주세요.';
          break;
        case 'WRONG_PASSWORD':
          message = '비밀번호가 일치하지 않습니다.';
          break;
        case 'USER_LOCKED':
          message = '로그인이 제한된 계정입니다. 고객센터로 문의해주세요.';
          break;
        default:
          message = '이메일이나 비밀번호를 잘못 입력하셨습니다';
          break;
      }
      setValidInfo(false);
      setErrorMessage(message);
    }

    setLoading(false);
  };

  return (
    <div className="loginButtonContainer">
      {loading ? (
        <div className="loginButton loadingLoginButton">로그인</div>
      ) : (
        <div
          className="loginButton"
          onClick={() => emailLogin(email, password)}
        >
          로그인
        </div>
      )}
    </div>
  );
};

export default LoginButton;
