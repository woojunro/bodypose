import React from 'react';
import { Link } from 'react-router-dom';
import './ConceptListCard.css';

const MainCardM = ({ studio, photoName, pic, thumb, horizontal }) => {
  return <img className="conceptListCard" alt="card" src={thumb} />;
};

export default MainCardM;
