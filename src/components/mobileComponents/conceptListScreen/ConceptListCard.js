import React from 'react';
import './ConceptListCard.css';

const ConceptListCard = ({
  src,
  setThisPhoto,
  conceptNum,
  openModal,
  needFetchMoreData,
}) => {
  return (
    <div className="concepListCardContainer">
      <div
        onClick={() => {
          setThisPhoto(conceptNum);
          openModal();
          needFetchMoreData(conceptNum);
        }}
      >
        <img className="conceptListCard" alt="card" src={src} />
      </div>
    </div>
  );
};

export default ConceptListCard;
