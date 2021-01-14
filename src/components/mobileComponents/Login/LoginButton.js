import React, { useContext } from 'react';
import LoginContext from '../../../contexts/LoginContext';
import { Login } from '../../functions/WithDb/Auth';
import './LoginButton.css';

const LoginButton = ({ email, password }) => {
  const LogedIn = useContext(LoginContext);

  //Db랑 이메일, 비밀번호 비교하는 함수.
  const LoginFunction = () => {
    LogedIn.setLogedIn(true);
    Login();
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
