import React from 'react';
import { CheckValidPassword } from '../function/Auth/LoginFunctions';
import './ChangePassword.css';

const ChangePassword = ({
  currentPassword = '',
  setCurrentPassword = () => {},
  newPassword = '',
  setNewPassword = () => {},
  passwordConfirm = '',
  setPasswordConfirm = () => {},
  isPasswordCorrect = true,
}) => {
  return (
    <div className="fullSizeBox">
      <div className="changePasswordContainer">
        <div className="changePassword">
          <div className="changePasswordLine">
            <div className="changePasswordText">현재 비밀번호</div>
            <input
              type="password"
              className="passwordChangeInput"
              value={currentPassword}
              placeholder="현재 비밀번호"
              onChange={e => setCurrentPassword(e.target.value)}
            />
          </div>
          {!isPasswordCorrect && (
            <div className="passwordWarning">
              비밀번호가 일치하지 않습니다. 비밀번호를 잊어버리셨다면 고객센터로
              문의해주시기 바랍니다.
            </div>
          )}
          <div className="changePasswordLine">
            <div className="changePasswordText">변경할 비밀번호</div>
            <input
              type="password"
              className="passwordChangeInput"
              value={newPassword}
              placeholder="비밀번호 (영문/숫자/특수문자)"
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>
          {newPassword.length > 7 && !CheckValidPassword(newPassword) && (
            <div className="passwordWarning">
              영문 소문자와 숫자를 각각 하나 이상 사용해주세요.
            </div>
          )}
          {newPassword.length > 0 && newPassword.length < 8 && (
            <div className="passwordWarning">비밀번호가 너무 짧습니다.</div>
          )}
          <div className="changePasswordLine">
            <div className="changePasswordText">비밀번호 확인</div>
            <input
              className="passwordChangeInput"
              type="password"
              value={passwordConfirm}
              placeholder="비밀번호 재입력"
              onChange={e => setPasswordConfirm(e.target.value)}
            />
          </div>
          {passwordConfirm.length > 0 && passwordConfirm !== newPassword && (
            <div className="passwordWarning">
              <div>비밀번호가 다릅니다.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
