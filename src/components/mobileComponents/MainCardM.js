import React from 'react';
import './MainCardM.css';
import bodylog from '../../materials/BodyLog.jpeg';
import aavec from '../../materials/Aavec.jpg';
import balancebutton from '../../materials/BalanceButton.jpg';
import flyn from '../../materials/Flyn.jpg';
import cocoviking from '../../materials/Cocoviking.jpg';

const MainCardM = ({ studioName, price }) => {
  const studio = () => {
    switch (studioName) {
      case 'bodylog':
        return bodylog;
      case 'aavec':
        return aavec;
      case 'flyn':
        return flyn;
      case 'cocoviking':
        return cocoviking;
      case 'balancebutton':
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
