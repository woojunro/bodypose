import React from 'react';
import './MainCardM.css';
import bodylog from '../../materials/BodyLog.jpeg';

const MainCardM = ({ studioName, price }) => {
  return (
    <div className="cardContainer">
      <div>
        <img alt="card" src={bodylog} />
      </div>
      <div className="studioInfoBox">
        <div className="studioName">{studioName}</div>
        <div className="studioPrice">{price}원~</div>
      </div>
    </div>
  );
};

export default MainCardM;
