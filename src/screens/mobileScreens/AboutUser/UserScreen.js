import React from 'react';
import BottomNavigation from '../../../components/mobileComponents/BottomNavigation';
import Header from '../../../components/mobileComponents/HeaderM';
import { Redirect, useHistory } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io/';
import Gmail from '../../../materials/gmail.png';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';

import './UserScreen.css';
import { useQuery, useReactiveVar } from '@apollo/client';
import { clearTokenAndCache, IsLoggedInVar } from '../../../apollo';
import { MY_USER_INFO_QUERY } from '../../../gql/queries/MyUserInfoQuery';
import { logout } from '../../../components/functions/Login/Logout';

const UserScreen = () => {
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const history = useHistory();

  const { data, loading } = useQuery(MY_USER_INFO_QUERY, {
    onCompleted: data => {
      if (!data.userInfo?.userInfo?.profile) {
        history.push('/createProfile');
      }
    },
    onError: () => {
      IsLoggedInVar(false);
    },
  });

  if (!isLoggedIn) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  const LogoutFunction = async () => {
    await logout();
    history.push('/');
    await clearTokenAndCache();
    IsLoggedInVar(false);
  };

  return loading ? (
    <>
      <Header pageName="users" />
      <div className="appLoader">
        <AppLoadingScreen />
      </div>
      <BottomNavigation pageName="users" />
    </>
  ) : (
    <div>
      <Header pageName="users" />
      <div className="welcome">
        <div className="nickNamePart">
          {data.userInfo.userInfo.profile?.nickname || '바프새내기'}
        </div>
        <div className="welcomePart">님 환영합니다.</div>
      </div>
      <div className="userSemiTitle">계정</div>
      <div
        onClick={() => {
          history.push('/users/myInfo');
          window.scrollTo(0, 0);
        }}
        className="userTap"
      >
        <div className="userTapName">계정</div>
        <IoIosArrowForward className="userArrow" />
      </div>
      <div
        onClick={() => {
          history.push('/users/profile');
          window.scrollTo(0, 0);
        }}
        className="userTap"
      >
        <div className="userTapName">프로필</div>
        <IoIosArrowForward className="userArrow" />
      </div>
      <div
        onClick={() => {
          history.push('/users/myReview');
          window.scrollTo(0, 0);
        }}
        className="userTap"
      >
        <div className="userTapName">내가 쓴 리뷰</div>
        <IoIosArrowForward className="userArrow" />
      </div>
      <div className="userLineContainer">
        <div className="userLine"></div>
      </div>
      <div className="userSemiTitle">고객센터</div>

      <a href="mailto:help@fmonth.com" style={{ textDecoration: 'none' }}>
        <div className="userTap">
          <div className="mailing">
            <span className="userTapName">Contact Us</span>
            <img className="gmailImage" alt="mail" src={Gmail} />
          </div>
          <IoIosArrowForward className="userArrow" />
        </div>
      </a>

      <div
        onClick={() => {
          history.push('/notices');
          window.scrollTo(0, 0);
        }}
        className="userTap"
      >
        <div className="userTapName">공지사항</div>

        <IoIosArrowForward className="userArrow" />
      </div>

      <div className="userTap" onClick={LogoutFunction}>
        <div className="userTapName">로그아웃</div>
        <IoIosArrowForward className="userArrow" />
      </div>

      <div
        onClick={() => {
          history.push('/users/leave');
          window.scrollTo(0, 0);
        }}
        className="userTap"
      >
        <div className="userTapName">탈퇴하기</div>
        <IoIosArrowForward className="userArrow" />
      </div>

      <div className="userLineContainer">
        <div className="userLine"></div>{' '}
      </div>
      <BottomNavigation pageName="users" />
    </div>
  );
};

export default UserScreen;
