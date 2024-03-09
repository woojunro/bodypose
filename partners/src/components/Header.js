import React from 'react';
import { useHistory } from 'react-router-dom';
import './Header.css';
import logo from '../materials/whitelogo.png';
import { useReactiveVar } from '@apollo/client';
import { IsLoggedInVar } from '../graphql/variables';
import logout from './function/Auth/logout';
import { LoggedOutPaths } from '../routers/LoggedOutRouter';
import useMyInfo from '../hooks/useMyInfo';
import { LoggedInPaths } from '../routers/LoggedInRouter';

const Header = () => {
  const history = useHistory();
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const { info } = useMyInfo();

  const RightSide = () => {
    return isLoggedIn ? (
      <div>
        <span
          className="headerStudioName"
          onClick={() => history.push(LoggedInPaths.MY_INFO)}
        >
          {info.name} 님
        </span>
        <span className="headerRight" onClick={logout}>
          로그아웃
        </span>
      </div>
    ) : (
      <div>
        <span
          className="headerRight"
          onClick={() => history.push(LoggedOutPaths.LOGIN)}
        >
          로그인
        </span>
        <span
          className="headerRight"
          onClick={() => history.push(LoggedOutPaths.JOIN)}
        >
          회원가입
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="headerContainer">
        <div className="logoPart" onClick={() => history.push('/')}>
          <img alt="logo" src={logo} />
          <div className="partnersText">Partners</div>
        </div>
        <RightSide />
      </div>
      <div className="headerBlankBox"></div>
    </>
  );
};

export default Header;
