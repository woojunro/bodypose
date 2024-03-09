import React from 'react';
import './LoginOptionButton.css';

const LoginOptionButton = ({ optionName, onClick }) => {
  return (
    <div className="loginOptionButtonContainer" onClick={onClick}>
      {optionName}
    </div>
  );
};

export default LoginOptionButton;
