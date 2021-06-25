import React, { useState, useEffect } from 'react';
import './LoginScreen.css';
import KakaoLogo from '../../../materials/kakao logo.png';
import GoogleLogo from '../../../materials/google logo.png';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import LoginButton from '../../../components/mobileComponents/Login/LoginButton';
import { FiArrowLeft } from 'react-icons/fi';
import { Redirect, useHistory } from 'react-router-dom';
import { GobackArrow } from '../../../components/functions/Login/GobackArrow';
import { useMutation, useReactiveVar } from '@apollo/client';
import { SOCIAL_LOGIN_MUTATION } from '../../../gql/mutations/LoginMutation';
import GoogleLogin from 'react-google-login';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';
import {
  PRIVACY_NOTICE_ID,
  TEMRS_NOTICE_ID,
} from '../../../constants/noticeIds';
import { alertError } from '../../../components/functions/Common/alertError';
import { IsLoggedInVar } from '../../../apollo';
import {
  KAKAO_LOGIN_SCRIPT_URL,
  NAVER_LOGIN_CALLBACK_URL,
  NAVER_LOGIN_SCRIPT_URL,
} from '../../../constants/urls';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validInfo, setValidInfo] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const history = useHistory();

  const [socialLogin, { loading }] = useMutation(SOCIAL_LOGIN_MUTATION, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      if (data.createOrLoginUserWithOAuth.ok) {
        const { token } = data.createOrLoginUserWithOAuth;
        localStorage.setItem('jwt', token);
        history.push('/');
      }
    },
    onError: () => alertError(),
  });

  useEffect(() => {
    const initKakaoLogin = () => {
      if (!window.Kakao) return;
      window.Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY);
    };

    const initNaverLogin = () => {
      if (!window.naver) return;
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
        callbackUrl: `https://${window.location.hostname}${NAVER_LOGIN_CALLBACK_URL}`,
        isPopup: false,
        loginButton: {
          color: 'green',
          type: 1,
          height: 60,
        },
      });
      naverLogin.init();
    };

    const kakaoScript = document.createElement('script');
    kakaoScript.addEventListener('load', initKakaoLogin);
    kakaoScript.src = KAKAO_LOGIN_SCRIPT_URL;
    kakaoScript.async = true;
    document.body.appendChild(kakaoScript);

    const naverScript = document.createElement('script');
    naverScript.addEventListener('load', initNaverLogin);
    naverScript.src = NAVER_LOGIN_SCRIPT_URL;
    naverScript.async = true;
    document.body.appendChild(naverScript);

    return () => {
      kakaoScript.removeEventListener('load', initKakaoLogin);
      naverScript.removeEventListener('load', initNaverLogin);
      document.body.removeChild(kakaoScript);
      document.body.removeChild(naverScript);
    };
  }, []);

  const loginWithKakao = () => {
    const { Kakao } = window;
    Kakao.Auth.login({
      success: function (response) {
        socialLogin({
          variables: {
            accessToken: response.access_token,
            provider: 'KAKAO',
          },
        });
      },
      fail: function (error) {
        alertError();
      },
    });
  };

  const loginWithGoogle = token => {
    if (!token) {
      alertError();
      return;
    }
    socialLogin({
      variables: {
        accessToken: token,
        provider: 'GOOGLE',
      },
    });
  };

  return isLoggedIn ? (
    <Redirect to={{ pathname: '/users' }} />
  ) : (
    <>
      {loading ? (
        <div className="appFullScreen">
          <AppLoadingScreen />
        </div>
      ) : (
        <div>
          <div className="loginContainer">
            <div className="loginPart">
              <FiArrowLeft
                onClick={() => {
                  GobackArrow(history);
                }}
                className="loginBackArrow"
              />
              <div className="loginTitle">로그인</div>
              <div className="loginEmailText">이메일</div>
              <InputForm
                onInputSubmit={setEmail}
                placeholder="이메일"
                type="text"
              />
              <div className="loginEmailText">비밀번호</div>
              <InputForm
                onInputSubmit={setPassword}
                placeholder="비밀번호"
                type="password"
              />
              {!validInfo ? (
                <div className="unvalidInfoText">{errorMessage}</div>
              ) : null}
              <LoginButton
                email={email}
                password={password}
                setValidInfo={setValidInfo}
                setErrorMessage={setErrorMessage}
              />
              <div className="forgotPasswordContainer">
                <div
                  className="forgotPassword"
                  onClick={() => history.push('/changePassword')}
                >
                  비밀번호가 기억나지 않아요
                </div>
              </div>
              <div className="snsLoginContainerContainer">
                <div className="snsLoginContainer">
                  <img
                    className="snsLogin"
                    onClick={loginWithKakao}
                    alt="카카오"
                    src={KakaoLogo}
                  />
                  <div className="naverIdLoginButtonContainer">
                    <div id="naverIdLogin" />
                  </div>
                  <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
                    render={renderProps => (
                      <img
                        className="snsLogin"
                        onClick={renderProps.onClick}
                        alt="구글"
                        src={GoogleLogo}
                      />
                    )}
                    buttonText=""
                    onSuccess={response => loginWithGoogle(response.tokenId)}
                    onFailure={response => {
                      console.error(response.error);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="autoAgreeContainer">
              <span>소셜 로그인 시</span>

              <span
                onClick={() => {
                  history.push(`/notices/${TEMRS_NOTICE_ID}`);
                }}
                className="linkText"
              >
                이용약관
              </span>
              <span>,</span>

              <span
                onClick={() => {
                  history.push(`/notices/${PRIVACY_NOTICE_ID}`);
                }}
                className="linkText"
              >
                개인정보처리방침
              </span>
              <span>에 동의한 것으로 간주합니다.</span>
            </div>
            <div className="noIdContainer">
              <div className="noIdText">계정이 없으신가요?</div>
              <div
                className="startWithEmailText"
                onClick={() => {
                  history.push('/startWithEmail');
                  window.scrollTo(0, 0);
                }}
              >
                이메일로 시작하기
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginScreen;
