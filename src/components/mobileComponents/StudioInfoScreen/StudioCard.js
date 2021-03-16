import React from 'react';
import { useHistory } from 'react-router-dom';
import './StudioCard.css';

const StudioCard = ({ title, studioName, pic, price }) => {
  const history = useHistory();
  return (
    <div
      className="seeMoreCardContainer"
      onClick={() => {
        history.push(`/studios/${studioName}`);
        window.scrollTo(0, 0);
      }}
    >
      <div>
        <img alt="card" src={pic} />
      </div>
      <div className="seeMoreStudioInfoBox">
        <div className="seeMoreStudioName">{title}</div>
      </div>
    </div>
  );
};

export default StudioCard;
