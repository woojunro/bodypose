import React from 'react';
import './ConceptListCard.css';

const ConceptListCard = ({ src, setThisPhoto, openModal }) => {
  return (
    <div className="concepListCardContainer">
      <div
        onClick={() => {
          setThisPhoto();
          openModal();
        }}
      >
        <img className="conceptListCard" alt="컨셉" src={src} />
      </div>
    </div>
  );
};

export default ConceptListCard;
