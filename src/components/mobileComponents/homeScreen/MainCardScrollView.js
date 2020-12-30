import React from 'react';
import MainCardM from './MainCardM';
import './MainCardScrollView.css';
import SemiTitle from './SemiTitle';

import Flyn24 from '../../../virtualDB/images/Flyn24.jpg';
import aavec5 from '../../../virtualDB/images/AAVEC5.jpg';
import balanceButton21 from '../../../virtualDB/images/Balance Button21.jpg';
import coco18 from '../../../virtualDB/images/Coco18.jpg';
import Flyn7 from '../../../virtualDB/images/Flyn7.jpg';
import aavec17 from '../../../virtualDB/images/AAVEC17.jpg';

const MainCardScrollView = () => {
  const studioList = [
    {
      studioName: 'aavec',
      title: '아베크',
      price: '270,000원',
      mainPic: aavec5,
      mainThumb: aavec5,
      location: '재승시 우준구 연세동',
      rating: '9',
    },
    {
      studioName: 'balanceButton',
      title: '밸런스버튼',
      price: '280,000원',
      mainPic: balanceButton21,
      mainThumb: balanceButton21,
      location: '재승시 우준구 연세동',
      rating: '8',
    },
    {
      studioName: 'cocoViking',
      title: '코코바이킹',
      price: '290,000원',
      mainPic: coco18,
      mainThumb: coco18,
      location: '재승시 우준구 연세동',
      rating: '7',
    },
    {
      studioName: 'flyn',
      title: '플린',
      price: '256,000원',
      mainPic: Flyn24,
      mainThumb: Flyn24,
      location: '재승시 우준구 연세동',
      rating: '6',
    },
    {
      studioName: 'jason',
      title: '제이슨',
      price: '130,000원',
      mainPic: Flyn7,
      mainThumb: Flyn7,
      location: '재승시 우준구 연세동',
      rating: '5',
    },
    {
      studioName: 'woojun',
      title: '라이언',
      price: '600,000원',
      mainPic: aavec17,
      mainThumb: aavec17,
      location: '재승시 우준구 연세동',
      rating: '4',
    },
  ];
  const renderedStudio = studioList.map((studio) => {
    return (
      <li key={studio.studioName}>
        <MainCardM
          studioName={studio.studioName}
          pic={studio.mainThumb}
          price={studio.price}
          title={studio.title}
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
