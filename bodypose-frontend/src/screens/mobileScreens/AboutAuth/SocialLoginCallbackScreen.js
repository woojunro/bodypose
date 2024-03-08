import { useReactiveVar } from '@apollo/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Redirect, useHistory, useLocation, useParams } from 'react-router-dom';
import { IsLoggedInVar } from '../../../apollo';
import { CheckValidEmail } from '../../../components/functions/Login/LoginFunctions';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import { BASE_URL } from '../../../constants/urls';

import './SocialLoginCallbackScreen.css';

const SocialLoginCallbackScreen = () => {
  const { provider } = useParams();
  const location = useLocation();
  const history = useHistory();
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const [shouldInputEmail, setShouldInputEmail] = useState(false);
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [email, setEmail] = useState('');

  const socialLogin = async (provider, accessToken, email = null) => {
    const url = `${BASE_URL}/auth/login/oauth`;
    const payload = {
      provider,
      accessToken,
    };
    if (shouldInputEmail) {
      if (!email) return;
      payload.email = email;
    }
    setShouldInputEmail(false);
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(url, payload);
      if (res.data.access && res.data.refresh) {
        window.location.reload();
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message;
      switch (errorMessage) {
        case 'EMAIL_NOT_FOUND':
          setShouldInputEmail(true);
          break;
        case 'DUPLICATE_EMAIL':
          setShouldInputEmail(true);
          setIsEmailDuplicate(true);
          break;
        default:
          alert('로그인에 실패하였습니다. 로그인 화면으로 이동합니다.');
          history.push('/login');
          break;
      }
    }
  };

  useEffect(() => {
    try {
      const key = location.hash.split('=')[0];
      if (key !== '#access_token') throw new Error();
      const accessToken = location.hash.split('=')[1].split('&')[0];
      socialLogin(provider.toUpperCase(), accessToken);
    } catch (e) {
      history.push('/error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsEmailDuplicate(false);
  }, [email]);

  return isLoggedIn ? (
    <Redirect to={{ pathname: '/login' }} />
  ) : shouldInputEmail ? (
    <>
      <div>
        <FiArrowLeft
          onClick={() => history.replace('/login')}
          className="loginBackArrow"
        />
        <div className="loginTitle">이메일 입력</div>
        <div className="changePasswordNotice">
          사용하실 이메일을 입력해주세요.
        </div>
        <div className="joinEmailText">이메일</div>
        <InputForm
          initialValue={email}
          onInputSubmit={setEmail}
          type="email"
          placeholder="이메일"
        />
        {email.length === 0 || CheckValidEmail(email) ? null : (
          <div className="passwordWarning">정확한 이메일을 입력해주세요.</div>
        )}
        {isEmailDuplicate && (
          <div className="passwordWarning">이미 사용중인 이메일입니다.</div>
        )}
      </div>
      <div className="newPasswordBottomPart newEmailBottomPart">
        {!isEmailDuplicate && CheckValidEmail(email) ? (
          <div
            onClick={() => {
              socialLogin(
                provider.toUpperCase(),
                location.hash.split('=')[1].split('&')[0],
                email
              );
            }}
            className="passwordConfirmButton"
          >
            가입 완료
          </div>
        ) : (
          <div className="inactivePasswordConfirmButton">가입 완료</div>
        )}
      </div>
    </>
  ) : (
    <div className="appFullScreenCenter">
      로그인 중입니다. 잠시만 기다려주세요.
    </div>
  );
};

export default SocialLoginCallbackScreen;
