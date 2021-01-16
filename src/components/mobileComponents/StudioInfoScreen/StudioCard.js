import React from 'react';
import { Link } from 'react-router-dom';
import './StudioCard.css';

const StudioCard = ({ title, studioName, pic, price }) => {
  return (
    <Link to={`/studios/${studioName}`} onClick={() => window.scrollTo(0, 0)}>
      <div className="seeMoreCardContainer">
        <div>
          <img alt="card" src={pic} />
        </div>
        <div className="seeMoreStudioInfoBox">
          <div className="seeMoreStudioName">{title}</div>
        </div>
      </div>
    </Link>
  );
};

export default StudioCard;
