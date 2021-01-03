import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderM.css';
import SerachIcon from '../../materials/icons/search.png';

import logo from '../../materials/Logo.png';

const Header = ({ pageName }) => {
  //홈페이지 헤더.
  if (pageName === 'home') {
    return (
      <div>
        <div className="header">
          <div className="headerLogo">
            <Link to="/">
              <img src={logo} alt="BodyPose" />
            </Link>
          </div>
        </div>
        <div style={{ height: '50px' }} />
      </div>
    );
  }
  if (pageName === 'studios') {
    return (
      <div>
        <div className="header">
          <span className="headerTitle">스튜디오</span>
          <img className="searchIcon" alt="Search" src={SerachIcon} />
        </div>
        <div style={{ height: '50px' }} />
      </div>
    );
  }
  return <div>ho</div>;
};

export default Header;
