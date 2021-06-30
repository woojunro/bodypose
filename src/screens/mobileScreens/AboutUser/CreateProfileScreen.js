import './CreateProfileScreen.css';
import {
  NetworkStatus,
  useMutation,
  useQuery,
  useReactiveVar,
} from '@apollo/client';
import React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Select from 'react-select';
import { IsLoggedInVar } from '../../../apollo';
import { extractGenderLabel } from '../../../components/functions/Common/extractGenderLabel';
import { CheckValidUserName } from '../../../components/functions/Login/LoginFunctions';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import { GENDER_OPTIONS } from '../../../constants/genderOptions';
import { CREATE_MY_PROFILE_MUTATION } from '../../../gql/mutations/ProfileMutation';
import { alertError } from '../../../components/functions/Common/alertError';
import { MY_USER_INFO_QUERY } from '../../../gql/queries/MyUserInfoQuery';

const CreateProfileScreen = () => {
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const [nickname, setNickname] = useState('');
  const [isMale, setIsMale] = useState(null);
  const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);

  const { data, refetch, networkStatus } = useQuery(MY_USER_INFO_QUERY, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [createMyProfile, { loading }] = useMutation(
    CREATE_MY_PROFILE_MUTATION,
    {
      onCompleted: data => {
        const { ok, error } = data.createMyProfile;
        if (ok) {
          refetch();
        } else {
          if (error === 'DUPLICATE_NICKNAME') {
            setIsNicknameDuplicate(true);
          } else {
            alertError();
          }
        }
      },
      onError: alertError,
    }
  );

  const handleNicknameChange = nickname => {
    setIsNicknameDuplicate(false);
    setNickname(nickname);
  };

  const canSubmit = () => CheckValidUserName(nickname) && !isNicknameDuplicate;

  const onSubmit = () => {
    const input = isMale === null ? { nickname } : { nickname, isMale };
    createMyProfile({ variables: { input } });
  };

  return isLoggedIn ? (
    data?.userInfo?.userInfo?.profile ? (
      <Redirect to={{ pathname: '/users' }} />
    ) : (
      <div>
        <div className="joinContainer">
          <div className="joinPart">
            <div className="loginTitle createProfileTitle">프로필 입력</div>
            <div className="joinEmailText">닉네임</div>
            <InputForm
              className="joinInput"
              onInputSubmit={handleNicknameChange}
              placeholder="닉네임 (2~10자, 영문/한글/숫자)"
              type="text"
            />
            {isNicknameDuplicate && (
              <div className="passwordWarning">이미 사용중인 닉네임입니다.</div>
            )}
            {nickname.length > 0 && !CheckValidUserName(nickname) && (
              <div className="passwordWarning">
                한글/영문/숫자만 2~10자로 입력해주세요.
              </div>
            )}
            <div className="joinEmailText">성별</div>
            <Select
              className="createProfileGenderSelect"
              options={GENDER_OPTIONS}
              onChange={selectedOption => setIsMale(selectedOption.value)}
              value={{ value: isMale, label: extractGenderLabel(isMale) }}
            />
            <div className="startButtonContainer createProfileButton">
              {canSubmit() &&
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
    )
  ) : (
    <Redirect to={{ pathname: '/error' }} />
  );
};

export default CreateProfileScreen;
