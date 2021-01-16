import React from 'react';
import { Link } from 'react-router-dom';
import './MainCardM.css';

const MainCardM = ({ title, studioName, pic, price }) => {
  return (
    <Link to={`/studios/${studioName}`} onClick={() => window.scrollTo(0, 0)}>
      <div className="cardContainer">
        <div>
          <img alt="card" src={pic} />
        </div>
        <div className="studioInfoBox">
          <div className="studioName">{title}</div>
          <div className="studioPrice">{price}원~</div>
        </div>
      </div>
    </Link>
  );
};

export default MainCardM;
