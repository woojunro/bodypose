import React from 'react';
import './MenuLogo.css';

const MenuLogo = ({ logo }) => {
  return (
    <div className="menuLogo">
      {logo ? (
        <img src={logo} alt="스튜디오 로고" />
      ) : (
        <div className="menuLogo_no_logo">
          <span>LOGO</span>
        </div>
      )}
    </div>
  );
};
export default MenuLogo;
