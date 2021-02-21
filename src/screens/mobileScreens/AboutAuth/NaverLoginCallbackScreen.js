import { useMutation } from '@apollo/client';
import React, { useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { SOCIAL_LOGIN_MUTATION } from '../../../gql/mutations/LoginMutation';
import LoginContext from '../../../contexts/LoginContext';

const NaverLoginCallbackScreen = () => {
  const location = useLocation();
  const history = useHistory();
  const LoggedIn = useContext(LoginContext);
  const [socialLogin] = useMutation(SOCIAL_LOGIN_MUTATION, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      if (data.createOrLoginUserWithOAuth.ok) {
        const { token } = data.createOrLoginUserWithOAuth;
        localStorage.setItem('jwt', token);
        LoggedIn.setLoggedIn(true);
        history.push('/');
      } else {
        alert('로그인에 실패하였습니다. 로그인 화면으로 이동합니다.');
        history.push('/login');
      }
    },
    onError: () => {
      alert('로그인에 실패하였습니다. 로그인 화면으로 이동합니다.');
      history.push('/login');
    },
  });

  useEffect(() => {
    try {
      const key = location.hash.split('=')[0];
      if (key !== '#access_token') throw new Error();
      const accessToken = location.hash.split('=')[1].split('&')[0];
      socialLogin({
        variables: {
          accessToken,
          provider: 'NAVER',
        },
      });
    } catch (e) {
      history.push('/error');
    }
  }, []);

  return (
    <div className="appFullScreenCenter">
      로그인 중입니다. 잠시만 기다려주세요.
    </div>
  );
};

export default NaverLoginCallbackScreen;
