import React, { useContext, useState } from 'react';
import LoginContext from '../../../contexts/LoginContext';
import { Login, CheckEmailPassword } from '../../functions/WithDb/Auth';
import './LoginButton.css';

const LoginButton = ({ email, password, setValidInfo }) => {
  const LoggedIn = useContext(LoginContext);

  //Db랑 이메일, 비밀번호 비교하는 함수.
  const LoginFunction = () => {
    if (CheckEmailPassword()) {
      setValidInfo(true);
      LoggedIn.setLoggedIn(true);
      Login(email, password);
    } else {
      setValidInfo(false);
    }
  };
  return (
    <div className="loginButtonContainer">
      <div
        className="loginButton"
        onClick={() => {
          LoginFunction();
        }}
      >
        로그인
      </div>
    </div>
  );
};

export default LoginButton;
