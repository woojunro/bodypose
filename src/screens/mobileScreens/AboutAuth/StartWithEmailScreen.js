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
  CheckAlreadyUsedEmail,
  CheckAlreadyUsedUserName,
} from '../../../components/functions/WithDb/Auth';

const EmailJoin = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [checkPassword, setCheckPassword] = useState('');
  const [someError, setSomeError] = useState(true);

  useEffect(() => {
    if (
      CheckValidEmail(email) &&
      !CheckAlreadyUsedEmail(email) &&
      CheckValidPassword(password) &&
      password === checkPassword &&
      CheckValidUserName(userName) &&
      !CheckAlreadyUsedUserName(userName) &&
      checked
    ) {
      setSomeError(false);
    } else {
      setSomeError(true);
    }
  }, [email, password, userName, checked]);
  return (
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
        {!CheckAlreadyUsedEmail(email) || email === '' ? null : (
          <div className="passwordWarning">이미 사용중인 이메일입니다.</div>
        )}
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
            <div>패스워드가 다릅니다.</div>
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
        {!CheckAlreadyUsedUserName(userName) || userName === '' ? null : (
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
          <Link to="/notices/1" style={{ color: 'black' }}>
            <span className="linkText"> 서비스 이용약관,</span>
          </Link>
          <Link to="/notices/2" style={{ color: 'black' }}>
            <span className="linkText">개인정보 처리방침</span>
          </Link>
          <span>에 동의합니다.</span>
        </div>
        <div className="startButtonContainer">
          <StartButton
            email={email}
            password={password}
            userName={userName}
            someError={someError}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailJoin;
