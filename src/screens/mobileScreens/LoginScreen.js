import React, { useState } from 'react';
import './LoginScreen.css';
import KakaoLogo from '../../materials/kakao logo.png';
import NaverLogo from '../../materials/naver logo.png';
import GoogleLogo from '../../materials/google logo.png';
import FacebookLogo from '../../materials/facebook logo.png';
import InputForm from '../../components/mobileComponents/Login/InputForm';
import { FiArrowLeft } from 'react-icons/fi';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log(email, password);
  return (
    <div>
      <FiArrowLeft className="loginBackArrow" />
      <div className="loginTitle">로그인</div>
      <div className="loginEmailText">이메일</div>
      <InputForm onInputSubmit={setEmail} title="이메일" />
      <div className="loginEmailText">비밀번호</div>
      <InputForm onInputSubmit={setPassword} title="비밀번호" />
    </div>
  );
};

export default LoginScreen;
