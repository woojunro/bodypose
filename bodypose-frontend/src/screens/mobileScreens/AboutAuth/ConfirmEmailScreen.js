import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';
import { CONFIRM_EMAIL_MUTATION } from '../../../gql/mutations/ConfirmEmailMutation';

import './ConfirmEmailScreen.css';

const ConfirmEmailScreen = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const onError = () => {
    setIsLoading(false);
    setIsError(true);
    setTimeout(() => {
      history.replace('/');
      window.location.reload();
    }, 3000);
  };

  const [confirmEmail] = useMutation(CONFIRM_EMAIL_MUTATION, {
    onCompleted: data => {
      if (data.verifyUser.ok) {
        setIsLoading(false);
        setTimeout(() => {
          history.replace('/');
          window.location.reload();
        }, 3000);
      } else {
        onError();
      }
    },
    onError,
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const userId = Number(params.get('userId'));
    const code = params.get('code');
    confirmEmail({
      variables: {
        userId,
        code,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="appFullScreen">
        <AppLoadingScreen />
      </div>
    );
  }

  return (
    <>
      {isError ? (
        <div className="confirmEmailFullScreen">
          <p>오류가 발생하였습니다.</p>
          <p>홈페이지로 이동합니다.</p>
        </div>
      ) : (
        <div className="confirmEmailFullScreen">
          <p>이메일 인증에 성공하였습니다.</p>
          <p>홈페이지로 이동합니다.</p>
        </div>
      )}
    </>
  );
};

export default ConfirmEmailScreen;
