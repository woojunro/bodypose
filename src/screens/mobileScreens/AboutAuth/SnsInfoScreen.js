import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { CheckValidUserName } from '../../../components/functions/Login/LoginFunctions';
import { CheckAlreadyUsedUserName } from '../../../components/functions/WithDb/Auth';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import { StartButton } from '../../../components/mobileComponents/Login/StartButton';

const SnsInfoScreen = () => {
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [checked, setChecked] = useState(false);
  const [someError, setSomeError] = useState(true);
  useEffect(() => {
    if (
      CheckValidUserName(userName) &&
      !CheckAlreadyUsedUserName(userName) &&
      checked
    ) {
      setSomeError(false);
    } else {
      setSomeError(true);
    }
  }, [userName, checked]);

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
          <Link
            to="/notices/1"
            style={{ color: 'black' }}
            onClick={() => window.scrollTo(0, 0)}
          >
            <span className="linkText"> 서비스 이용약관,</span>
          </Link>
          <Link
            to="/notices/2"
            style={{ color: 'black' }}
            onClick={() => window.scrollTo(0, 0)}
          >
            <span className="linkText">개인정보 처리방침</span>
          </Link>
          <span>에 동의합니다.</span>
        </div>
        <div className="startButtonContainer">
          <StartButton userName={userName} someError={someError} />
        </div>
      </div>
    </div>
  );
};

export default SnsInfoScreen;
