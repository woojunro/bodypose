import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import './NewPasswordScreen.css';

const NewPasswordScreen = ({ match }) => {
  const authCode = match.params.authCode;
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const history = useHistory();
  //새로운 비밀번호 저장 후 홈 화면으로 넘어감.
  const confirmChange = () => {
    if (
      password.length > 7 &&
      /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9a-zA-Z]*$/.test(password) &&
      password === checkPassword
    ) {
      history.push('/');
    }
  };

  return (
    <div className="newPasswordScreen">
      <div>
        <FiArrowLeft
          onClick={() => history.goBack()}
          className="loginBackArrow"
        />
        <div className="loginTitle">비밀번호 바꾸기</div>

        <div className="changePasswordNotice">
          새로운 비밀번호를 입력해주세요.
        </div>

        <div className="joinEmailText">비밀번호 (8자 이상)</div>
        <InputForm
          onInputSubmit={setPassword}
          type="password"
          placeholder="비밀번호 (영문/숫자/특수문자)"
        />
        {password.length > 7 || password === '' ? null : (
          <div className="passwordWarning">비밀번호가 너무 짧습니다.</div>
        )}
        {/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9a-zA-Z]*$/.test(
          password
        ) ? null : (
          <div className="passwordWarning">
            비밀번호는 영문/숫자/특수문자만 포함할 수 있습니다.
          </div>
        )}
        <div className="joinEmailText">비밀번호 확인</div>
        <InputForm
          onInputSubmit={setCheckPassword}
          placeholder="비밀번호 다시 입력"
          type="password"
        />
        {password === checkPassword ? null : (
          <div className="passwordWarning">
            <div>비밀번호가 다릅니다.</div>
          </div>
        )}
      </div>
      <div className="newPasswordBottomPart">
        <div
          onClick={() => {
            confirmChange();
          }}
          className="passwordConfirmButton"
        >
          비밀번호 변경
        </div>
      </div>
    </div>
  );
};
export default NewPasswordScreen;
