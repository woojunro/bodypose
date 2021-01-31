import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderM.css';

import logoAndsymbol from '../../materials/로고+심볼.png';

const Header = ({ pageName }) => {
  //홈페이지 헤더.
  if (pageName === 'home') {
    return (
      <div>
        <div className="header">
          <div className="headerLogo">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <img src={logoAndsymbol} alt="BodyPose" />
            </Link>
          </div>
        </div>
        <div style={{ height: '50px' }} />
      </div>
    );
  }
  if (pageName === 'hearts') {
    return (
      <div>
        <div className="header">
          <span className="headerTitle">찜목록</span>
        </div>
        <div style={{ height: '50px' }} />
      </div>
    );
  }
  if (pageName === 'users') {
    return (
      <div>
        <div className="header">
          <span className="headerTitle">내정보</span>
        </div>
        <div style={{ height: '50px' }} />
      </div>
    );
  }
  return <div>ho</div>;
};

export default Header;
