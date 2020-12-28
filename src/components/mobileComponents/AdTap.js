import React from 'react';
import './AdTap.css';
import { Link } from 'react-router-dom';

const AdTap = () => {
  return (
    <div className="adTap">
      <Link to="/about">
        <img
          alt="바디프로필의 모든 정보 바디포즈"
          src="https://www.wenw.co.kr/news/photo/202006/248_298_3813.jpg"
        />
      </Link>
    </div>
  );
};

export default AdTap;
