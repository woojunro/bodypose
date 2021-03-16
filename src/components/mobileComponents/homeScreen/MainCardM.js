import React from 'react';
import { useHistory } from 'react-router-dom';
import './MainCardM.css';

const MainCardM = ({ title, studioName, pic, price }) => {
  const history = useHistory();
  return (
    <div
      onClick={() => {
        window.scrollTo(0, 0);
        history.push({
          pathname: `/studios/${studioName}`,
          state: { previousPath: history.location.pathname },
        });
      }}
      className="cardContainer"
    >
      <div>
        <img alt="card" src={pic} />
      </div>
      <div className="studioInfoBox">
        <div className="studioName">{title}</div>
        <div className="studioPrice">{price && price.toLocaleString()}원~</div>
      </div>
    </div>
  );
};

export default MainCardM;
