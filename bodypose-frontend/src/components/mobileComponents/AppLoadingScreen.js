import React from 'react';

import './AppLoadingScreen.css';
import Symbol from '../../materials/Symbol.png';

const AppLoadingScreen = ({ big }) => (
  <div className="appLoadingLogo">
    <img
      className={big ? 'appLoadingLogoBigImg' : 'appLoadingLogoSmallImg'}
      src={Symbol}
      alt="바디포즈"
    />
  </div>
);

export default AppLoadingScreen;
