import React, { useState } from 'react';
import Select from 'react-select';
import './MyProfileScreen.css';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';
import BottomNavigation from '../../../components/mobileComponents/BottomNavigation';
import {
  NetworkStatus,
  useMutation,
  useQuery,
  useReactiveVar,
} from '@apollo/client';
import { MY_PROFILE_QUERY } from '../../../gql/queries/MyProfileQuery';
import { IsLoggedInVar } from '../../../apollo';
import { Redirect } from 'react-router-dom';
import { UPDATE_MY_PROFILE_MUTATION } from '../../../gql/mutations/ProfileMutation';
import { alertError } from '../../../components/functions/Common/alertError';
import { CheckValidUserName } from '../../../components/functions/Login/LoginFunctions';

const MyProfileScreen = () => {
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isMale, setIsMale] = useState(false);
  const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);

  const genderOptions = [
    { value: true, label: '남성' },
    { value: false, label: '여성' },
    { value: null, label: '선택 안함' },
  ];

  const extractGenderLabel = isMale =>
    isMale ? '남성' : isMale === false ? '여성' : '선택 안함';

  const { data, loading, refetch, networkStatus } = useQuery(MY_PROFILE_QUERY, {
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      const { ok, error } = data.userProfile;
      if (ok) {
        initializeProfileData(data);
      } else {
        if (error === 'PROFILE_NOT_FOUND') {
          // 프로필 생성 창으로
          console.log('NO_PROFILE');
        }
      }
    },
  });

  const initializeProfileData = data => {
    setNickname(data.userProfile.profile.nickname);
    setIsMale(data.userProfile.profile.isMale);
  };

  const [updateMyProfile, { loading: updateLoading }] = useMutation(
    UPDATE_MY_PROFILE_MUTATION,
    {
      onCompleted: data => {
        if (data.updateMyProfile.ok) {
          refetch();
          setIsNicknameDuplicate(false);
          setIsEditing(false);
        } else {
          if (data.updateMyProfile.error === 'DUPLICATE_NICKNAME') {
            setIsNicknameDuplicate(true);
          } else {
            alertError();
          }
        }
      },
      onError: alertError,
    }
  );

  const toggleEdit = () => {
    if (isEditing) {
      const input =
        nickname === data.userProfile.profile.nickname
          ? { isMale }
          : { nickname, isMale };
      updateMyProfile({
        variables: {
          input,
        },
      });
    } else {
      initializeProfileData(data);
      setIsEditing(!isEditing);
    }
  };

  return !isLoggedIn ? (
    <Redirect to={{ pathname: '/login' }} />
  ) : (
    <div>
      <div className="usersTopContainer">
        <FiArrowLeft
          className="usersGoBackArrow"
          onClick={() => {
            history.goBack();
          }}
        />
        <div className="leaveTitle myProfileScreenTitle">프로필</div>
        <div className="editAndSaveProfile" onClick={toggleEdit}>
          {isEditing ? '저장하기' : '수정하기'}
        </div>
      </div>
      {loading || updateLoading || networkStatus === NetworkStatus.refetch ? (
        <div className="appLoader">
          <AppLoadingScreen />
        </div>
      ) : (
        <div className="userInfoContainer">
          <div className="userInfoSemiTitle">닉네임</div>
          {isEditing ? (
            <>
              <input
                className="loginInput userInfoSemiTitle myProfileNicknameInput"
                onChange={e => setNickname(e.target.value)}
                placeholder="닉네임(2~10자, 영문/한글/숫자)"
                type="text"
                value={nickname}
              />
              {isNicknameDuplicate && (
                <div className="passwordWarning myProfileScreenWarning">
                  이미 사용중인 닉네임입니다.
                </div>
              )}
              {!CheckValidUserName(nickname) && (
                <div className="passwordWarning myProfileScreenWarning">
                  한글/영문/숫자만 2~10자로 입력해주세요.
                </div>
              )}
            </>
          ) : (
            <div className="userInfoText">
              {data.userProfile.profile.nickname}
            </div>
          )}
          <div className="userInfoSemiTitle">성별</div>
          {isEditing ? (
            <Select
              className="myProfileGenderSelect"
              options={genderOptions}
              onChange={selectedOption => setIsMale(selectedOption.value)}
              value={{ value: isMale, label: extractGenderLabel(isMale) }}
            />
          ) : (
            <div className="userInfoText">
              {extractGenderLabel(data.userProfile.profile.isMale)}
            </div>
          )}
        </div>
      )}
      <BottomNavigation pageName="users" />
    </div>
  );
};

export default MyProfileScreen;
