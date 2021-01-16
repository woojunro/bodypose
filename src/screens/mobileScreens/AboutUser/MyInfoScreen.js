import './MyInfoScreen.css';
import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import { GetUser } from '../../../components/functions/WithDb/User';
import { FiArrowLeft } from 'react-icons/fi';
import { Redirect, useHistory } from 'react-router-dom';
import LoginContext from '../../../contexts/LoginContext';
import BottomNavigation from '../../../components/mobileComponents/BottomNavigation';

const MyInfoScreen = () => {
  const LogedIn = useContext(LoginContext);
  const history = useHistory();
  const user = GetUser();

  if (!LogedIn.logedIn) {
    return <Redirect to={'/error'} />;
  } else {
    return (
      <>
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
        <div className="userInfoContainer">
          <div className="userInfoSemiTitle">이메일</div>
          <div className="userInfoText">{user[0].email}</div>
          <div className="userInfoSemiTitle">이름</div>
          <div className="userInfoText">{user[0].userName}</div>

          <div className="userInfoSemiTitle">비밀번호</div>
          <div className="userInfoPassword">
            <div>*********</div>
            <Link
              onClick={() => window.scrollTo(0, 0)}
              to="/changePassword"
              style={{ Decoder: 'none', color: 'white' }}
            >
              <div className="userInfoChange">수정하기</div>
            </Link>
          </div>
        </div>

        <BottomNavigation pageName="users" />
      </>
    );
  }
};

export default MyInfoScreen;
