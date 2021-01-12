import React, { useContext } from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';
import LoginContext from '../../components/LoginContext';
import { Redirect, useHistory } from 'react-router-dom';
import { GetUser } from '../../components/functions/WithDb/User';
import { IoIosArrowForward } from 'react-icons/io/';
import Gmail from '../../materials/gmail.png';
import './UserScreen.css';
const UserScreen = () => {
  const LogedIn = useContext(LoginContext);
  const history = useHistory();
  const user = GetUser();

  if (!LogedIn.logedIn) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { previousPath: history.location.pathname },
        }}
      />
    );
  }
  return (
    <div>
      <Header pageName="users" />
      <div className="welcome">
        <div className="nickNamePart">{user[0].userName}</div>
        <div className="welcomePart">님 환영합니다.</div>
      </div>
      <div className="userSemiTitle">계정</div>
      <div className="userTap">
        <div className="userTapName">내 정보 관리</div>
        <IoIosArrowForward className="userArrow" />
      </div>
      <div className="userTap">
        <div className="userTapName">내가 쓴 리뷰</div>
        <IoIosArrowForward className="userArrow" />
      </div>
      <div className="userLineContainer">
        <div className="userLine"></div>{' '}
      </div>
      <div className="userSemiTitle">고객센터</div>
      <div className="userTap">
        <div className="mailing">
          <span className="userTapName">Contact Us</span>
          <img className="gmailImage" alt="mail" src={Gmail} />
        </div>
        <IoIosArrowForward className="userArrow" />
      </div>
      <div className="userTap">
        <div className="userTapName">공지사항</div>

        <IoIosArrowForward className="userArrow" />
      </div>
      <div className="userTap">
        <div className="userTapName">로그아웃</div>
        <IoIosArrowForward className="userArrow" />
      </div>
      <div className="userTap">
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
