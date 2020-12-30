import React from 'react';
import { Link } from 'react-router-dom';
import './MainCardM.css';

const MainCardM = ({ studioName, pic, price, number }) => {
  return (
    <Link to={`/studios/${number}`}>
      <div className="cardContainer">
        <div>
          <img alt="card" src={pic} />
        </div>
        <div className="studioInfoBox">
          <div className="studioName">{studioName}</div>
          <div className="studioPrice">{price}원~</div>
        </div>
      </div>
    </Link>
  );
};

export default MainCardM;
