import React, { useState, useContext } from 'react';
import './LoginScreen.css';
import KakaoLogo from '../../../materials/kakao logo.png';
import NaverLogo from '../../../materials/naver logo.png';
import GoogleLogo from '../../../materials/google logo.png';
import FacebookLogo from '../../../materials/facebook logo.png';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import LoginButton from '../../../components/mobileComponents/Login/LoginButton';
import { FiArrowLeft } from 'react-icons/fi';
import LoginContext from '../../../contexts/LoginContext';
import { SnsLogin } from '../../../components/functions/WithDb/Auth';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { GobackArrow } from '../../../components/functions/Login/GobackArrow';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validInfo, setValidInfo] = useState(true);
  const LogedIn = useContext(LoginContext);
  const history = useHistory();

  const SnsLoginFunction = () => {
    SnsLogin();
  };

  if (LogedIn.logedIn) {
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
  } else {
    return (
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
          />{' '}
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
              <div className="forgotPassword">비밀번호가 기억나지 않아요</div>
            </Link>
          </div>
          <div className="snsLoginContainerContainer">
            <div className="snsLoginContainer">
              <img
                className="snsLogin"
                onClick={() => SnsLoginFunction()}
                alt="카카오"
                src={KakaoLogo}
              />

              <img
                className="snsLogin"
                onClick={() => SnsLoginFunction()}
                alt="네이버"
                src={NaverLogo}
              />
              <img
                className="snsLogin"
                onClick={() => SnsLoginFunction()}
                alt="페이스북"
                src={FacebookLogo}
              />
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
    );
  }
};

export default LoginScreen;
