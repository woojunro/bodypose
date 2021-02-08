import React, { useState, useEffect } from 'react';
import { CheckValidEmail } from '../../../components/functions/Login/LoginFunctions';

import InputForm from '../../../components/mobileComponents/Login/InputForm';
import { FiArrowLeft } from 'react-icons/fi';
import ChangePasswordButton from '../../../components/mobileComponents/Login/ChangePasswordButton';

import './ChangePasswordScreen.css';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REQUEST_PASSWORD_CHANGE_MUTATION } from '../../../gql/mutations/ChangePasswordMutation';

const ChangePasswordScreen = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [correctEmail, setCorrectEmail] = useState(true);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSocialAccount, setIsSocialAccount] = useState(false);
  const [isMyOwnEmail, setIsMyOwnEmail] = useState(true);

  const [requestPasswordChange, { loading }] = useMutation(
    REQUEST_PASSWORD_CHANGE_MUTATION,
    {
      onCompleted: data => {
        if (data.requestPasswordReset.ok) {
          setIsEmailSent(true);
        } else {
          const { error } = data.requestPasswordReset;
          if (error === 'UNAUTHORIZED') {
            setIsMyOwnEmail(false);
          } else if (error === 'USER_NOT_FOUND') {
            setCorrectEmail(false);
          } else if (error === 'INVALID_LOGIN_METHOD') {
            setIsSocialAccount(true);
          } else {
            alert('오류가 발생하였습니다. 다시 시도해주세요.');
          }
        }
      },
      onError: () => alert('오류가 발생하였습니다. 다시 시도해주세요.'),
    }
  );

  const mailingFunction = () => {
    requestPasswordChange({ variables: { email } });
  };

  useEffect(() => {
    if (email === '') {
      setIsMyOwnEmail(true);
      setIsSocialAccount(false);
      setCorrectEmail(true);
      setValidEmail(true);
    } else {
      setIsMyOwnEmail(true);
      setIsSocialAccount(false);
      setCorrectEmail(true);
      setValidEmail(CheckValidEmail(email));
    }
  }, [email]);

  return (
    <div>
      <div className="joinContainer">
        {isEmailSent ? (
          <div>
            <FiArrowLeft
              onClick={() => history.goBack()}
              className="loginBackArrow"
            />
            <div className="loginTitle">비밀번호 바꾸기</div>
            <div className="changePasswordEmailSentDiv">
              <p>이메일로 링크를 전송하였습니다.</p>
              <p>링크 접속 후 비밀번호 변경을 진행해주세요.</p>
              <p>링크의 유효기간은 1시간입니다.</p>
            </div>
          </div>
        ) : (
          <>
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
              {correctEmail ? null : (
                <div className="noValidEmailText">
                  가입되지 않은 이메일입니다.
                </div>
              )}
              {!isSocialAccount ? null : (
                <div className="noValidEmailText">
                  소셜 가입 회원은 비밀번호 변경이 불가합니다.
                </div>
              )}
              {isMyOwnEmail ? null : (
                <div className="noValidEmailText">
                  본인의 이메일만 요청 가능합니다.
                </div>
              )}
            </div>

            <div className="startButtonPart">
              <ChangePasswordButton
                onClickButton={mailingFunction}
                email={email}
                validEmail={!loading && email !== '' && validEmail}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordScreen;
