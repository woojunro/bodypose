import React from 'react';
import { Link } from 'react-router-dom';
import './MainConceptsCard.css';

const MainConceptsCard = ({ thumb, pic, photoName, horizon }) => {
  if (!horizon) {
    return (
      <div className="conceptsCardContainer-Vertical">
        <Link to={`/concepts/${photoName}`}>
          <img alt="conceptsCard" src={thumb} />
        </Link>
      </div>
    );
  }
  return (
    <div className="conceptsCardContainer-Horizon">
      <Link to={`/concepts/${photoName}`}>
        <img alt="conceptsCard" src={thumb} />
      </Link>
    </div>
  );
};

export default MainConceptsCard;
