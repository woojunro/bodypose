import React, { useState } from 'react';
import './ChangePasswordScreen.css';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import ChangePasswordButton from '../../../components/mobileComponents/Login/ChangePasswordButton';

const ChangePasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  return (
    <div className="joinContainer">
      <div>
        <FiArrowLeft
          onClick={() => history.goBack()}
          className="loginBackArrow"
        />
        <div className="loginTitle">비밀번호 바꾸기</div>
        <div className="changePasswordNotice">
          가입한 이메일을 입력해주세요.
        </div>
        <div className="joinEmailText">이메일</div>
        <InputForm
          className="joinInput"
          onInputSubmit={setEmail}
          placeholder="이메일"
          type="text"
        />
      </div>
      <div className="startButtonPart">
        <div className="startButtonContainer">
          <ChangePasswordButton email={email} />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordScreen;
