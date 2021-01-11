import React from 'react';
import './ChangePasswordButton.css';

export const ChangePasswordButton = ({ email, someError }) => {
  return (
    <div className="startButtonContainer">
      <div className="startButton">이메일 보내기</div>
    </div>
  );
};
export default ChangePasswordButton;
