import React from 'react';
import { useHistory } from 'react-router-dom';
import './HeaderM.css';

import logoAndsymbol from '../../materials/로고+심볼.png';

const Header = ({ pageName }) => {
  const history = useHistory();
  //홈페이지 헤더.
  if (pageName === 'home') {
    return (
      <div>
        <div className="header">
          <div className="headerLogo">
            <img
              src={logoAndsymbol}
              alt="BodyPose"
              onClick={() => {
                history.push('/');
                window.scrollTo(0, 0);
              }}
            />
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
