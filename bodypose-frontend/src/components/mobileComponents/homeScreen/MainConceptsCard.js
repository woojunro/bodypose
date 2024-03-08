import React, { useState } from 'react';
import ConceptModal from './ConceptModal';
import './MainConceptsCard.css';

const MainConceptsCard = ({ concept }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <ConceptModal
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
        concept={concept}
      />
      <div
        onClick={() => setIsModalOpen(true)}
        className="conceptsCardContainer-Vertical"
      >
        <img alt="conceptsCard" src={concept.originalUrl} />
      </div>
    </div>
  );
};

export default MainConceptsCard;
