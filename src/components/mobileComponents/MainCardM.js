import React from 'react';
import './MainCardM.css';
import bodylog from '../../materials/BodyLog.jpeg';
import aavec from '../../materials/Aavec.jpg';
import balancebutton from '../../materials/BalanceButton.jpg';
import flyn from '../../materials/Flyn.jpg';
import cocoviking from '../../materials/CocoViking.jpg';

const MainCardM = ({ studioName, price }) => {
  const studio = () => {
    switch (studioName) {
      case '바디로그':
        return bodylog;
      case '아베크':
        return aavec;
      case '플린':
        return flyn;
      case '코코바이킹':
        return cocoviking;
      case '밸런스버튼':
        return balancebutton;
      default:
        return balancebutton;
    }
  };
  return (
    <div className="cardContainer">
      <div>
        <img alt="card" src={studio()} />
      </div>
      <div className="studioInfoBox">
        <div className="studioName">{studioName}</div>
        <div className="studioPrice">{price}원~</div>
      </div>
    </div>
  );
};

export default MainCardM;
