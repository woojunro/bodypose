import {
  NetworkStatus,
  useMutation,
  useQuery,
  useReactiveVar,
} from '@apollo/client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router';
import { IsLoggedInVar } from '../../../apollo';
import { alertError } from '../../../components/functions/Common/alertError';
import { CheckValidEmail } from '../../../components/functions/Login/LoginFunctions';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import { shouldUpdateEmail } from '../../../constants/shouldUpdateEmail';
import { UPDATE_EMAIL_MUTATION } from '../../../gql/mutations/UpdateEmailMutation';
import { MY_USER_INFO_QUERY } from '../../../gql/queries/MyUserInfoQuery';

const UpdateEmailScreen = () => {
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const [email, setEmail] = useState('');
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);

  const {
    data,
    loading: queryLoading,
    refetch,
    networkStatus,
  } = useQuery(MY_USER_INFO_QUERY, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [updateEmail, { loading: mutationLoading }] = useMutation(
    UPDATE_EMAIL_MUTATION,
    {
      onCompleted: data => {
        const { ok, error } = data.updateEmail;
        if (ok) {
          refetch();
        } else {
          if (error === 'DUPLICATE_EMAIL') {
            setIsEmailDuplicate(true);
          } else {
            alertError();
          }
        }
      },
      onError: alertError,
    }
  );

  useEffect(() => {
    setIsEmailDuplicate(false);
  }, [email]);

  const canSubmit = CheckValidEmail(email) && !isEmailDuplicate;
  const loading = queryLoading || mutationLoading;

  const onSubmit = () => {
    const input = { userId: data?.userInfo?.userInfo?.id, email };
    updateEmail({ variables: { input } });
  };

  return isLoggedIn ? (
    loading ? (
      <div className="appFullScreen">
        <AppLoadingScreen />
      </div>
    ) : !data.userInfo?.userInfo?.email ||
      shouldUpdateEmail(data.userInfo.userInfo.email) ? (
      <div>
        <div className="joinContainer">
          <div className="joinPart">
            <div className="loginTitle createProfileTitle">
              이메일을 등록해주세요.
            </div>
            <div className="joinEmailText">이메일</div>
            <InputForm
              className="joinInput"
              onInputSubmit={setEmail}
              placeholder="이메일"
              type="email"
              initialValue={email}
            />
            {isEmailDuplicate && (
              <div className="passwordWarning">이미 사용중인 이메일입니다.</div>
            )}
            {email.length > 0 && !CheckValidEmail(email) && (
              <div className="passwordWarning">
                정확한 이메일을 입력해주세요.
              </div>
            )}
            <div className="startButtonContainer createProfileButton">
              {canSubmit &&
              !loading &&
              networkStatus !== NetworkStatus.refetch ? (
                <div className="startButtonContainer" onClick={onSubmit}>
                  <div className="startButton">완료</div>
                </div>
              ) : (
                <div className="unactiveStartButtonContainer">
                  <div className="unactiveStartButton">완료</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <>
        <Redirect to={{ pathname: '/users' }} />
      </>
    )
  ) : (
    <Redirect to={{ pathname: '/error' }} />
  );
};

export default UpdateEmailScreen;
