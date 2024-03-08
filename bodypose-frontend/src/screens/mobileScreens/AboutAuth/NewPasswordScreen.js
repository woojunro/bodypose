import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { alertError } from '../../../components/functions/Common/alertError';
import { CheckValidPassword } from '../../../components/functions/Login/LoginFunctions';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import { CHANGE_PASSWORD_MUTATION } from '../../../gql/mutations/ChangePasswordMutation';
import './NewPasswordScreen.css';

const NewPasswordScreen = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const userId = Number(params.get('userId'));
  const code = params.get('code');
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD_MUTATION, {
    onCompleted: data => {
      if (data.updatePassword.ok) {
        setIsPasswordChanged(true);
      } else {
        const { error } = data.updatePassword;
        if (error === 'INVALID_REQUEST') {
          alert('비인가 접근입니다. 홈페이지로 이동합니다.');
          history.push('/');
        } else if (error === 'CODE_EXPIRED') {
          alert('링크의 유효기간이 만료되었습니다. 홈페이지로 이동합니다.');
          history.push('/');
        } else {
          alertError();
        }
      }
    },
    onError: alertError,
  });

  useEffect(() => {
    if (isPasswordChanged) {
      setTimeout(() => {
        history.push('/');
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPasswordChanged]);

  const confirmChange = () => {
    changePassword({
      variables: {
        userId,
        code,
        newPassword: password,
      },
    });
  };

  return (
    <div className="newPasswordScreen">
      {isPasswordChanged ? (
        <div className="appFullScreenCenter">
          <p>비밀번호가 변경되었습니다.</p>
          <p>잠시 후 홈페이지로 이동합니다.</p>
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
            {/^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?0-9a-zA-Z]*$/.test(
              password
            ) ? null : (
              <div className="passwordWarning">
                비밀번호는 영문/숫자/특수문자만 포함할 수 있습니다.
              </div>
            )}
            {password.length < 8 ||
            /^(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(password) ? null : (
              <div className="passwordWarning">
                영문 소문자와 숫자를 각각 하나 이상 포함해야 합니다.
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
            {!loading &&
            CheckValidPassword(password) &&
            password === checkPassword ? (
              <div
                onClick={() => {
                  confirmChange();
                }}
                className="passwordConfirmButton"
              >
                비밀번호 변경
              </div>
            ) : (
              <div className="inactivePasswordConfirmButton">비밀번호 변경</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NewPasswordScreen;
