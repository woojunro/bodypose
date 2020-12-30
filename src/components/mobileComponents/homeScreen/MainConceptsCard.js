import React from 'react';
import { Link } from 'react-router-dom';
import './MainConceptsCard.css';

const MainConceptsCard = ({ pic, number }) => {
  return (
    <div className="conceptsCardContainer">
      <Link to={`/concepts/${number}`}>
        <img alt="conceptsCard" src={pic} />
      </Link>
    </div>
  );
};

export default MainConceptsCard;
