import { useMutation } from '@apollo/client';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import LoginContext from '../../../contexts/LoginContext';
import { EMAIL_REGISTER_MUTATION } from '../../../gql/mutations/RegisterMutation';
import './StartButton.css';

export const StartButton = ({
  someError,
  email,
  password,
  userName,
  setIsEmailAlreadyUsed,
  setIsNameAlreadyUsed,
}) => {
  const history = useHistory();
  const { setLoggedIn } = useContext(LoginContext);

  const [registerWithEmail, { loading }] = useMutation(
    EMAIL_REGISTER_MUTATION,
    {
      fetchPolicy: 'no-cache',
      onCompleted: data => {
        if (data.createUserWithEmail.ok) {
          const { token } = data.createUserWithEmail;
          setToken(token);
        } else {
          const { error } = data.createUserWithEmail;
          if (error === 'DUPLICATE_EMAIL') {
            setIsEmailAlreadyUsed(true);
          } else if (error === 'DUPLICATE_NICKNAME') {
            setIsEmailAlreadyUsed(false);
            setIsNameAlreadyUsed(true);
          }
        }
      },
      onError: () => alert('오류가 발생하였습니다. 다시 시도해주세요.'),
    }
  );

  const setToken = token => {
    localStorage.setItem('jwt', token);
    setLoggedIn(true);
    history.push('/');
  };

  const handleEmailLogin = () => {
    registerWithEmail({
      variables: {
        email,
        password,
        nickname: userName,
      },
    });
  };

  return (
    <>
      {someError || loading ? (
        <div className="unactiveStartButtonContainer">
          <div className="unactiveStartButton">시작하기</div>
        </div>
      ) : (
        <div className="startButtonContainer">
          <div onClick={email && handleEmailLogin} className="startButton">
            시작하기
          </div>
        </div>
      )}
    </>
  );
};
