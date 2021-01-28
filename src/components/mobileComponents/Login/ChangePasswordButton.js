import React from 'react';
import './ChangePasswordButton.css';

export const ChangePasswordButton = ({ email, validEmail, onClickButton }) => {
  return validEmail ? (
    <div className="startButtonContainer">
      <div onClick={onClickButton} className="startButton">
        이메일 보내기
      </div>
    </div>
  ) : (
    <div className="unactiveStartButtonContainer">
      <div className="unactiveStartButton">이메일 보내기</div>
    </div>
  );
};
export default ChangePasswordButton;
