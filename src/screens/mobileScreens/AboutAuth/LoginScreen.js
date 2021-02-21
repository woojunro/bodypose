import React, { useState, useContext, useEffect } from 'react';
import './LoginScreen.css';
import KakaoLogo from '../../../materials/kakao logo.png';
import GoogleLogo from '../../../materials/google logo.png';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import LoginButton from '../../../components/mobileComponents/Login/LoginButton';
import { FiArrowLeft } from 'react-icons/fi';
import LoginContext from '../../../contexts/LoginContext';
import { SnsLogin } from '../../../components/functions/WithDb/Auth';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { GobackArrow } from '../../../components/functions/Login/GobackArrow';
import { useMutation } from '@apollo/client';
import { SOCIAL_LOGIN_MUTATION } from '../../../gql/mutations/LoginMutation';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validInfo, setValidInfo] = useState(true);
  const LoggedIn = useContext(LoginContext);
  const history = useHistory();

  const [socialLogin, { loading }] = useMutation(SOCIAL_LOGIN_MUTATION, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      if (data.createOrLoginUserWithOAuth.ok) {
        const { token } = data.createOrLoginUserWithOAuth;
        localStorage.setItem('jwt', token);
        LoggedIn.setLoggedIn(true);
        history.push('/');
      }
    },
    onError: () => alert('오류가 발생하였습니다. 다시 시도해주세요.'),
  });

  const SnsLoginFunction = () => {
    SnsLogin();
  };

  const initializeNaverLogin = () => {
    const { naver } = window;
    const naverLogin = new naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
      callbackUrl: process.env.REACT_APP_NAVER_LOGIN_CALLBACK_URL,
      isPopup: false,
      loginButton: {
        color: 'green',
        type: 1,
        height: 60,
      },
    });
    naverLogin.init();
  };

  useEffect(() => {
    initializeNaverLogin();
  }, []);

  const loginWithKakao = () => {
    const { Kakao } = window;
    Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY);
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
        alert('오류가 발생하였습니다. 다시 시도해주세요.');
      },
    });
  };

  if (LoggedIn.loggedIn) {
    if (!history.location.state) {
      return <Redirect to={{ pathname: '/error' }} />;
    } else {
      if (history.location.state.previousPath === '/hearts') {
        return (
          <Redirect
            to={{
              pathname: '/',
            }}
          />
        );
      } else if (history.location.state.previousPath === '/users') {
        return (
          <Redirect
            to={{
              pathname: '/',
            }}
          />
        );
      } else {
        history.goBack();
        return null;
      }
    }
  } else {
    return (
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
                  <div className="unvalidInfoText">
                    이메일 혹은 비밀번호 오류입니다.
                  </div>
                ) : null}
                <LoginButton
                  email={email}
                  password={password}
                  setValidInfo={setValidInfo}
                />
                <div className="forgotPasswordContainer">
                  <Link
                    onClick={() => window.scrollTo(0, 0)}
                    to="/changePassword"
                    style={{ TextDecoder: 'none', color: 'white' }}
                  >
                    <div className="forgotPassword">
                      비밀번호가 기억나지 않아요
                    </div>
                  </Link>
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
                    <img
                      className="snsLogin"
                      onClick={() => SnsLoginFunction()}
                      alt="구글"
                      src={GoogleLogo}
                    />
                  </div>
                </div>
              </div>
              <div className="noIdContainer">
                <div className="noIdText">계정이 없으신가요?</div>
                <Link
                  to="/startWithEmail"
                  style={{ color: 'gray' }}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="startWithEmailText">이메일로 시작하기</div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
};

export default LoginScreen;
