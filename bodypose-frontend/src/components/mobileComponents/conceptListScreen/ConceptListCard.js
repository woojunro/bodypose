import React from 'react';
import './ConceptListCard.css';

const ConceptListCard = ({ src, setThisPhoto, openModal }) => {
  return (
    <div className="concepListCardContainer">
      <div
        onClick={() => {
          window.history.pushState(null, document.title, window.location.href);

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
