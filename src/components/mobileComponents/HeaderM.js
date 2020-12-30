import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderM.css';

import logo from '../../materials/Logo.png';

const Header = ({ pageName }) => {
  //홈페이지 헤더.
  if (pageName === 'home') {
    return (
      <div style={{ height: '55px' }}>
        <div className="header">
          <div className="header__logo">
            <Link to="/">
              <img src={logo} alt="BodyPose" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return <div>ho</div>;
};

export default Header;
