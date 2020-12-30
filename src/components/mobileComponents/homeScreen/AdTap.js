import React from 'react';
import './AdTap.css';
import { Link } from 'react-router-dom';
import ad from '../../../materials/Ad.png';

const AdTap = () => {
  return (
    <div className="adTap">
      <Link to="/about">
        <img alt="바디프로필의 모든 정보 바디포즈" src={ad} />
      </Link>
    </div>
  );
};

export default AdTap;
