import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Redirect, useHistory } from 'react-router-dom';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import { StartButton } from '../../../components/mobileComponents/Login/StartButton';
import {
  CheckValidEmail,
  CheckValidPassword,
} from '../../../components/functions/Login/LoginFunctions';
import './StartWithEmailScreen.css';
import {
  PRIVACY_NOTICE_ID,
  TEMRS_NOTICE_ID,
} from '../../../constants/noticeIds';
import { useReactiveVar } from '@apollo/client';
import { IsLoggedInVar } from '../../../apollo';

const EmailJoin = () => {
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [checkPassword, setCheckPassword] = useState('');
  const [someError, setSomeError] = useState(true);
  const [isEmailAlreadyUsed, setIsEmailAlreadyUsed] = useState(false);

  useEffect(() => {
    if (
      CheckValidEmail(email) &&
      CheckValidPassword(password) &&
      password === checkPassword &&
      checked
    ) {
      setSomeError(false);
    } else {
      setSomeError(true);
    }
    setIsEmailAlreadyUsed(false);
  }, [email, password, checkPassword, checked]);

  return isLoggedIn ? (
    <Redirect to={{ pathname: '/error' }} />
  ) : (
    <div>
      <div className="joinContainer">
        <div className="joinPart">
          <FiArrowLeft
            onClick={() => {
              history.goBack();
            }}
            className="loginBackArrow"
          />
          <div className="loginTitle">이메일로 시작하기</div>
          <div className="joinEmailText">이메일</div>
          <InputForm
            className="joinInput"
            onInputSubmit={setEmail}
            placeholder="이메일"
            type="text"
          />
          {CheckValidEmail(email) || email === '' ? null : (
            <div className="passwordWarning">잘못된 이메일 형식입니다.</div>
          )}
          {!isEmailAlreadyUsed ? null : (
            <div className="passwordWarning">이미 사용중인 이메일입니다.</div>
          )}
          <div className="joinEmailText">비밀번호 (8자 이상)</div>
          <InputForm
            onInputSubmit={setPassword}
            type="password"
            placeholder="비밀번호 (영문/숫자/특수문자)"
          />
          {password.length > 7 || password === '' ? (
            password === '' ||
            /^(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(password) ? null : (
              <div className="passwordWarning">
                영문 소문자와 숫자를 각각 하나 이상 사용해주세요.
              </div>
            )
          ) : (
            <div className="passwordWarning">비밀번호가 너무 짧습니다.</div>
          )}
          {/^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?0-9a-zA-Z]*$/.test(
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
        <div className="startButtonPart">
          <div className="agreeContainer">
            <input
              type="checkBox"
              onChange={() => {
                setChecked(!checked);
              }}
            />
            <span className="mustText">[필수] </span>

            <span
              onClick={() => {
                history.push(`/notices/${TEMRS_NOTICE_ID}`);
                window.scrollTo(0, 0);
              }}
              className="linkText"
            >
              서비스 이용약관,
            </span>
            <span
              onClick={() => {
                history.push(`/notices/${PRIVACY_NOTICE_ID}`);
                window.scrollTo(0, 0);
              }}
              className="linkText"
            >
              개인정보 처리방침
            </span>
            <span>에 동의합니다.</span>
          </div>
          <div className="startButtonContainer">
            <StartButton
              email={email}
              password={password}
              someError={someError}
              setIsEmailAlreadyUsed={setIsEmailAlreadyUsed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailJoin;
