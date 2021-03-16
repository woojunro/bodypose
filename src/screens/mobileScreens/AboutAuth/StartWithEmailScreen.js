import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import { StartButton } from '../../../components/mobileComponents/Login/StartButton';
import {
  CheckValidEmail,
  CheckValidPassword,
  CheckValidUserName,
} from '../../../components/functions/Login/LoginFunctions';
import './StartWithEmailScreen.css';
import {
  PRIVACY_NOTICE_ID,
  TEMRS_NOTICE_ID,
} from '../../../constants/noticeIds';

const EmailJoin = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [checkPassword, setCheckPassword] = useState('');
  const [someError, setSomeError] = useState(true);

  const [isEmailAlreadyUsed, setIsEmailAlreadyUsed] = useState(false);
  const [isNameAlreadyUsed, setIsNameAlreadyUsed] = useState(false);

  useEffect(() => {
    if (
      CheckValidEmail(email) &&
      CheckValidPassword(password) &&
      password === checkPassword &&
      CheckValidUserName(userName) &&
      checked
    ) {
      setSomeError(false);
    } else {
      setSomeError(true);
    }
  }, [email, password, checkPassword, userName, checked]);

  return (
    <div>
      <div className="joinContainer">
        <div className="joinPart">
          <FiArrowLeft
            onClick={() => {
              history.goBack();
            }}
            className="loginBackArrow"
          />
          <div className="loginTitle">필수 정보 입력</div>
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
          <div className="joinEmailText">이름 (10자 이하)</div>
          <InputForm
            className="joinInput"
            onInputSubmit={setUserName}
            placeholder="사용할 이름(한글/영어/숫자)"
            type="text"
          />
          {/^[0-9a-zA-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/.test(userName) ||
          userName === '' ? null : (
            <div className="passwordWarning">
              이름은 한글/영어/숫자만 포함할 수 있습니다.
            </div>
          )}
          {userName.length < 11 ? null : (
            <div className="passwordWarning">
              이름은 10글자까지 설정할 수 있습니다.
            </div>
          )}
          {!isNameAlreadyUsed ? null : (
            <div className="passwordWarning">이미 사용중인 이름입니다.</div>
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
              userName={userName}
              someError={someError}
              setIsEmailAlreadyUsed={setIsEmailAlreadyUsed}
              setIsNameAlreadyUsed={setIsNameAlreadyUsed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailJoin;
