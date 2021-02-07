import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';
import { CONFIRM_EMAIL_MUTATION } from '../../../gql/mutations/ConfirmEmailMutation';

import './ConfirmEmailScreen.css';

const ConfirmEmailScreen = () => {
  const { code } = useParams();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [confirmEmail] = useMutation(CONFIRM_EMAIL_MUTATION, {
    onCompleted: data => {
      if (data.verifyUser.ok) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setIsError(true);
      }
    },
    onError: () => {
      setIsLoading(false);
      setIsError(true);
    },
  });

  useEffect(() => {
    confirmEmail({
      variables: {
        code,
      },
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        history.push('/');
      }, 3000);
    }
  }, [isLoading]);

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
