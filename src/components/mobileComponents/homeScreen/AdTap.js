import React from 'react';
import { HOMESCREEN_AD_URL } from '../../../constants/urls';
import './AdTap.css';

const AdTap = () => {
  return (
    <div className="adTap">
      <img alt="바디프로필의 모든 정보 바디포즈" src={HOMESCREEN_AD_URL} />
    </div>
  );
};

export default AdTap;
