import React, { useContext } from 'react';
import BottomNavigation from '../../../components/mobileComponents/BottomNavigation';
import Header from '../../../components/mobileComponents/HeaderM';
import LoginContext from '../../../contexts/LoginContext';
import { Redirect, useHistory, Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io/';
import Gmail from '../../../materials/gmail.png';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';

import './UserScreen.css';
import { useQuery } from '@apollo/client';
import { client } from '../../../apollo';
import { MY_PROFILE_QUERY } from '../../../gql/queries/MyProfileQuery';

const UserScreen = () => {
  const LoggedIn = useContext(LoginContext);
  const history = useHistory();

  const { data, loading } = useQuery(MY_PROFILE_QUERY, {
    onError: () => {
      LoggedIn.setLoggedIn(false);
    },
  });

  if (!LoggedIn.loggedIn) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { previousPath: history.location.pathname },
        }}
      />
    );
  }

  const LogoutFunction = () => {
    localStorage.clear();
    client.resetStore();
    LoggedIn.setLoggedIn(false);
    history.push('/');
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
        <div className="nickNamePart">{data.myProfile.profile.nickname}</div>
        <div className="welcomePart">님 환영합니다.</div>
      </div>
      <div className="userSemiTitle">계정</div>

      <Link
        onClick={() => window.scrollTo(0, 0)}
        to={'/users/myInfo'}
        style={{ textDecoration: 'none', color: 'white' }}
      >
        <div className="userTap">
          <div className="userTapName">내 정보 관리</div>
          <IoIosArrowForward className="userArrow" />
        </div>
      </Link>

      <Link
        onClick={() => window.scrollTo(0, 0)}
        to={'/users/myReview'}
        style={{ textDecoration: 'none', color: 'white' }}
      >
        <div className="userTap">
          <div className="userTapName">내가 쓴 리뷰</div>
          <IoIosArrowForward className="userArrow" />
        </div>
      </Link>

      <div className="userLineContainer">
        <div className="userLine"></div>
      </div>
      <div className="userSemiTitle">고객센터</div>

      <a
        href="mailto:help@fmonth.com"
        style={{ textDecoration: 'none', color: 'white' }}
      >
        <div className="userTap">
          <div className="mailing">
            <span className="userTapName">Contact Us</span>
            <img className="gmailImage" alt="mail" src={Gmail} />
          </div>
          <IoIosArrowForward className="userArrow" />
        </div>
      </a>

      <Link
        onClick={() => window.scrollTo(0, 0)}
        to={'/notices'}
        style={{ textDecoration: 'none', color: 'white' }}
      >
        <div className="userTap">
          <div className="userTapName">공지사항</div>

          <IoIosArrowForward className="userArrow" />
        </div>
      </Link>

      <div className="userTap" onClick={() => LogoutFunction()}>
        <div className="userTapName">로그아웃</div>
        <IoIosArrowForward className="userArrow" />
      </div>

      <Link
        onClick={() => window.scrollTo(0, 0)}
        to={'/users/leave'}
        style={{ textDecoration: 'none', color: 'white' }}
      >
        <div className="userTap">
          <div className="userTapName">탈퇴하기</div>
          <IoIosArrowForward className="userArrow" />
        </div>
      </Link>

      <div className="userLineContainer">
        <div className="userLine"></div>{' '}
      </div>
      <BottomNavigation pageName="users" />
    </div>
  );
};

export default UserScreen;
