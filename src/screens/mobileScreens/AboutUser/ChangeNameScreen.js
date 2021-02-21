import { useMutation, useQuery } from '@apollo/client';
import React, { useContext, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Redirect, useHistory } from 'react-router-dom';
import { CheckValidUserName } from '../../../components/functions/Login/LoginFunctions';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import LoginContext from '../../../contexts/LoginContext';
import { CHANGE_NICKNAME_MUTATION } from '../../../gql/mutations/ChangeNicknameMutation';
import { MY_PROFILE_QUERY } from '../../../gql/queries/MyProfileQuery';

import './ChangeNameScreen.css';

const ChangeNameScreen = () => {
  const history = useHistory();
  const LoggedIn = useContext(LoginContext);
  const [name, setName] = useState('');
  const [isNameAlreadyUsed, setIsNameAlreadyUsed] = useState(false);

  const { data, loading, refetch } = useQuery(MY_PROFILE_QUERY, {
    fetchPolicy: 'network-only',
    onError: () => {
      LoggedIn.setLoggedIn(false);
    },
  });

  const [updateNickname, { loading: updateLoading }] = useMutation(
    CHANGE_NICKNAME_MUTATION,
    {
      fetchPolicy: 'no-cache',
      onCompleted: data => {
        if (data.updateNickname.ok) {
          refetch();
          history.goBack();
        } else {
          if (data.updateNickname.error === 'DUPLICATE_NICKNAME') {
            setIsNameAlreadyUsed(true);
          } else {
            alert('오류가 발생하였습니다. 다시 시도해주세요.');
          }
        }
      },
      onError: () => alert('오류가 발생하였습니다. 다시 시도해주세요.'),
    }
  );

  const handleSubmit = () => {
    updateNickname({ variables: { nickname: name } });
  };

  if (!LoggedIn.loggedIn) return <Redirect to="/error" />;

  return (
    <>
      <FiArrowLeft
        onClick={() => history.goBack()}
        className="loginBackArrow"
      />
      <div className="loginTitle">이름 바꾸기</div>
      {loading || updateLoading ? (
        <div className="appLoader">
          <AppLoadingScreen />
        </div>
      ) : (
        <>
          <div className="changePasswordNotice">
            변경하실 이름을 입력해주세요.
          </div>
          <div className="joinEmailText">이름</div>
          <form className="changeNameScreenForm">
            <InputForm
              className="joinInput"
              onInputSubmit={setName}
              placeholder="이름"
              type="text"
              initialValue={data.myProfile.profile.nickname}
            />
            {!CheckValidUserName(name) && (
              <div className="passwordWarning">
                이름은 최대 10글자의 한글/영문/숫자만 가능합니다.
              </div>
            )}
            {isNameAlreadyUsed && (
              <div className="passwordWarning">
                이미 사용중인 이름입니다. 다른 이름을 입력해주세요.
              </div>
            )}
          </form>
          <div className="startButtonContainer">
            {CheckValidUserName(name) ? (
              <div onClick={handleSubmit} className="startButton">
                수정하기
              </div>
            ) : (
              <div className="unactiveStartButtonContainer">
                <div className="unactiveStartButton">수정하기</div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ChangeNameScreen;
