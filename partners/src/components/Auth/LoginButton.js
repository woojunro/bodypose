import React from 'react';
import './LoginButton.css';

const LoginButton = ({ loginFunction = () => {}, disabled = false }) => {
  return (
    <div className="loginButton" onClick={disabled ? () => {} : loginFunction}>
      로그인
    </div>
  );
};

export default LoginButton;
