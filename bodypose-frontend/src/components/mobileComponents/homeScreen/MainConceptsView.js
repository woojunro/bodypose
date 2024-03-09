import React from 'react';
import SemiTitle from './SemiTitle';
import { useMediaQuery } from 'react-responsive';

import './MainConceptsView.css';
import MainConceptsCard from './MainConceptsCard';

const MainConceptsView = ({ ConceptsList, semiTitle }) => {
  const isWide = useMediaQuery({
    query: '(min-width:720px)',
  });

  const renderedConceptsList = conceptsList =>
    conceptsList.map(concept => {
      return (
        <li key={`home-${concept.studio.slug}-${concept.id}`}>
          <MainConceptsCard concept={concept} />
        </li>
      );
    });
  if (!isWide) {
    return (
      <div className="mainContainer">
        <div className="mainConcpetsView">
          <SemiTitle title={semiTitle} pageTo="/concepts" />
          <ul> {renderedConceptsList(ConceptsList.slice(0, 2))}</ul>
          <ul> {renderedConceptsList(ConceptsList.slice(2, 4))}</ul>
        </div>
      </div>
    );
  }
  return (
    <div className="mainContainer">
      <div className="mainConcpetsView">
        <SemiTitle title={semiTitle} pageTo="/concepts" />
        <ul> {renderedConceptsList(ConceptsList.slice(0, 4))}</ul>
      </div>
    </div>
  );
};

export default MainConceptsView;
