import React, { useState, useEffect } from 'react';
import { CheckValidEmail } from '../../../components/functions/Login/LoginFunctions';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import { FiArrowLeft } from 'react-icons/fi';
import ChangePasswordButton from '../../../components/mobileComponents/Login/ChangePasswordButton';
import './ChangePasswordScreen.css';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { REQUEST_PASSWORD_CHANGE_MUTATION } from '../../../gql/mutations/ChangePasswordMutation';
import { MY_USER_INFO_QUERY } from '../../../gql/queries/MyUserInfoQuery';
import { alertError } from '../../../components/functions/Common/alertError';

const ChangePasswordScreen = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [correctEmail, setCorrectEmail] = useState(true);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSocialAccount, setIsSocialAccount] = useState(false);

  const { data, loading: queryLoading } = useQuery(MY_USER_INFO_QUERY);

  const [requestPasswordChange, { loading: mutationLoading }] = useMutation(
    REQUEST_PASSWORD_CHANGE_MUTATION,
    {
      onCompleted: data => {
        if (data.requestPasswordReset.ok) {
          setIsEmailSent(true);
        } else {
          const { error } = data.requestPasswordReset;
          if (error === 'USER_NOT_FOUND') {
            setCorrectEmail(false);
          } else if (error === 'SOCIAL_USER') {
            setIsSocialAccount(true);
          } else {
            alertError();
          }
        }
      },
      onError: alertError,
    }
  );

  const loading = queryLoading || mutationLoading;

  const mailingFunction = () => {
    const myEmail = data?.userInfo?.userInfo?.email;
    if (myEmail && myEmail !== email) {
      alert('본인의 이메일을 입력해주시기 바랍니다.');
      return;
    }
    requestPasswordChange({ variables: { email } });
  };

  useEffect(() => {
    if (email === '') {
      setIsSocialAccount(false);
      setCorrectEmail(true);
      setValidEmail(true);
    } else {
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
