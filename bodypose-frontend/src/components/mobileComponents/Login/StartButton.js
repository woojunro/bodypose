import { useMutation } from '@apollo/client';
import axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { clearCache, IsLoggedInVar } from '../../../apollo';
import { BASE_URL } from '../../../constants/urls';
import { EMAIL_REGISTER_MUTATION } from '../../../gql/mutations/RegisterMutation';
import { alertError } from '../../functions/Common/alertError';
import './StartButton.css';

export const StartButton = ({
  someError,
  email,
  password,
  setIsEmailAlreadyUsed,
}) => {
  const history = useHistory();
  const [registerWithEmail, { loading }] = useMutation(
    EMAIL_REGISTER_MUTATION,
    {
      fetchPolicy: 'no-cache',
      onCompleted: async data => {
        if (data.createUserWithEmail.ok) {
          const url = `${BASE_URL}/auth/login/email`;
          const payload = { email, password };
          axios.defaults.withCredentials = true;
          try {
            const res = await axios.post(url, payload);
            if (res.data.access && res.data.refresh) {
              await clearCache();
              IsLoggedInVar(true);
              history.push('/createProfile');
            } else {
              alertError();
            }
          } catch (e) {
            alertError();
          }
        } else {
          const { error } = data.createUserWithEmail;
          if (error === 'DUPLICATE_EMAIL') {
            setIsEmailAlreadyUsed(true);
          } else if (error === 'INSECURE_PASSWORD') {
            alertError();
          }
        }
      },
      onError: alertError,
    }
  );

  const handleEmailLogin = () => {
    registerWithEmail({
      variables: {
        email,
        password,
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
          <div onClick={handleEmailLogin} className="startButton">
            시작하기
          </div>
        </div>
      )}
    </>
  );
};
