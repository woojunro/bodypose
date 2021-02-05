import { useMutation } from '@apollo/client';
import React, { useContext } from 'react';
import LoginContext from '../../../contexts/LoginContext';
import { EMAIL_LOGIN_MUTATION } from '../../../gql/mutations/LoginMutation';
import './LoginButton.css';

const LoginButton = ({ email, password, setValidInfo }) => {
  const { setLoggedIn } = useContext(LoginContext);
  const [login, { loading }] = useMutation(EMAIL_LOGIN_MUTATION, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      if (data.loginWithEmail.ok) {
        const { token } = data.loginWithEmail;
        localStorage.setItem('jwt', token);
        setLoggedIn(true);
      } else {
        setValidInfo(false);
      }
    },
    onError: () => setValidInfo(false),
  });

  return (
    <div className="loginButtonContainer">
      {loading ? (
        <div className="loginButton loadingLoginButton">로그인</div>
      ) : (
        <div
          className="loginButton"
          onClick={() => login({ variables: { email, password } })}
        >
          로그인
        </div>
      )}
    </div>
  );
};

export default LoginButton;
