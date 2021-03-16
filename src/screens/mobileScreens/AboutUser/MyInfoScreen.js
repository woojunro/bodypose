import './MyInfoScreen.css';
import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Redirect, useHistory } from 'react-router-dom';
import LoginContext from '../../../contexts/LoginContext';
import BottomNavigation from '../../../components/mobileComponents/BottomNavigation';
import { useQuery } from '@apollo/client';
import { MY_PROFILE_QUERY } from '../../../gql/queries/MyProfileQuery';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';

const MyInfoScreen = () => {
  const LoggedIn = useContext(LoginContext);
  const history = useHistory();

  const { data, loading } = useQuery(MY_PROFILE_QUERY, {
    onError: () => LoggedIn.setLoggedIn(false),
  });

  if (!LoggedIn.loggedIn) {
    return <Redirect to={'/error'} />;
  } else {
    return (
      <div>
        <div className="usersTopContainer">
          <FiArrowLeft
            className="usersGoBackArrow"
            onClick={() => {
              history.goBack();
            }}
          />
          <div className="leaveTitle">내 정보 관리</div>
          <div className="myInfoSave">저장</div>
        </div>
        {loading ? (
          <div className="appLoader">
            <AppLoadingScreen />
          </div>
        ) : (
          <div className="userInfoContainer">
            <div className="userInfoSemiTitle">이메일</div>
            {data.myProfile.profile.email ? (
              <div className="userInfoText">{data.myProfile.profile.email}</div>
            ) : (
              <div className="userInfoText">소셜 회원입니다.</div>
            )}
            <div className="userInfoSemiTitle">이름</div>
            <div className="userInfoPassword">
              <div>{data.myProfile.profile.nickname}</div>

              <div
                onClick={() => {
                  history.push('/changeName');
                  window.scrollTo(0, 0);
                }}
                className="userInfoChange"
              >
                수정하기
              </div>
            </div>
            <div className="userInfoSemiTitle">비밀번호</div>
            {data.myProfile.profile.loginMethod === 'EMAIL' ? (
              <div className="userInfoPassword">
                <div>********</div>

                <div
                  onClick={() => {
                    history.push('/changePassword');
                    window.scrollTo(0, 0);
                  }}
                  className="userInfoChange"
                >
                  수정하기
                </div>
              </div>
            ) : (
              <div className="userInfoPassword">소셜 회원입니다.</div>
            )}
          </div>
        )}
        <BottomNavigation pageName="users" />
      </div>
    );
  }
};

export default MyInfoScreen;
