import React from 'react';
import MainCardM from './MainCardM';
import './MainCardScrollView.css';

const MainCardScrollView = () => {
  return (
    <span className="scrollView">
      <ul>
        <li>
          <MainCardM studioName="바디로그" price="256,000" />
        </li>
        <li>
          <MainCardM studioName="아베크" price="256,000" />
        </li>
        <li>
          <MainCardM studioName="밸런스버튼" price="256,000" />
        </li>
        <li>
          <MainCardM studioName="플린" price="256,000" />
        </li>
        <li>
          <MainCardM studioName="코코바이킹" price="256,000" />
        </li>
      </ul>
    </span>
  );
};

export default MainCardScrollView;
