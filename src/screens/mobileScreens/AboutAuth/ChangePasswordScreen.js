import React, { useState, useEffect } from 'react';
import { CheckValidEmail } from '../../../components/functions/Login/LoginFunctions';
import { CheckCorrectEmail } from '../../../components/functions/WithDb/Auth';

import './ChangePasswordScreen.css';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import ChangePasswordButton from '../../../components/mobileComponents/Login/ChangePasswordButton';

const ChangePasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [correctEmail, setCorrectEmail] = useState(true);
  const history = useHistory();

  const mailingFunction = () => {
    console.log(CheckCorrectEmail(email));
    if (CheckCorrectEmail(email)) {
      console.log('메일 보냈다잇');

      history.push('/NewPassword/123');
    } else {
      setCorrectEmail(false);
    }
  };

  useEffect(() => {
    setValidEmail(CheckValidEmail(email));
  }, [email]);

  return (
    <div>
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
          <form>
            <InputForm
              className="joinInput"
              onInputSubmit={setEmail}
              placeholder="이메일"
              type="text"
            />
          </form>
          {validEmail ? null : (
            <div className="noValidEmailText">
              올바르지 않은 형식의 이메일입니다.
            </div>
          )}
        </div>

        <div className="startButtonPart">
          {correctEmail ? null : (
            <div style={{ fontSize: '12px', marginLeft: '50px' }}>
              가입되지 않은 이메일입니다.
            </div>
          )}

          <ChangePasswordButton
            onClickButton={mailingFunction}
            email={email}
            validEmail={validEmail}
          />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordScreen;
