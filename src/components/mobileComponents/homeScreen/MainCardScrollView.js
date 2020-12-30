import React from 'react';
import MainCardM from './MainCardM';
import './MainCardScrollView.css';
import SemiTitle from './SemiTitle';

import bodylog from '../../../materials/BodyLog.jpeg';
import aavec from '../../../materials/Aavec.jpg';
import balancebutton from '../../../materials/BalanceButton.jpg';
import flyn from '../../../materials/Flyn.jpg';
import cocoviking from '../../../materials/CocoViking.jpg';

const MainCardScrollView = () => {
  const studioList = [
    {
      name: '바디로그',
      pic: bodylog,
      price: '256,000',
      number: 1,
    },
    {
      name: '아베크',
      pic: aavec,
      price: '300,000',
      number: 2,
    },
    {
      name: '밸런스버튼',
      pic: balancebutton,
      price: '280,000',
      number: 3,
    },
    {
      name: '플린',
      pic: flyn,
      price: '310,000',
      number: 4,
    },
    {
      name: '코코바이킹',
      pic: cocoviking,
      price: '320,000',
      number: 5,
    },
  ];
  const renderedStudio = studioList.map((studio) => {
    return (
      <li key={studio.number}>
        <MainCardM
          studioName={studio.name}
          pic={studio.pic}
          price={studio.price}
          number={studio.number}
        />
      </li>
    );
  });

  return (
    <div>
      <SemiTitle title="추천 스튜디오" pageTo="/studios" />
      <span className="scrollView">
        <ul>{renderedStudio}</ul>
      </span>
    </div>
  );
};

export default MainCardScrollView;
