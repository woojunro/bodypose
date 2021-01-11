import React from 'react';
import SemiTitle from './SemiTitle';
import { useMediaQuery } from 'react-responsive';

import './MainConceptsView.css';
import MainConceptsCard from './MainConceptsCard';

const MainConceptsView = ({ ConceptsList, semiTitle }) => {
  const isWide = useMediaQuery({
    query: '(min-width:720px)',
  });

  const renderedConceptsList = ConceptsList.map((concept) => {
    return (
      <li key={concept.photoName}>
        <MainConceptsCard concept={concept} />
      </li>
    );
  });
  if (!isWide) {
    return (
      <div className="mainConcpetsView">
        <SemiTitle title={semiTitle} pageTo="/concepts" />
        <ul> {renderedConceptsList.slice(0, 2)}</ul>
        <ul> {renderedConceptsList.slice(2, 4)}</ul>
      </div>
    );
  }
  return (
    <div className="mainConcpetsView">
      <SemiTitle title={semiTitle} pageTo="/concepts" />
      <ul> {renderedConceptsList}</ul>
    </div>
  );
};

export default MainConceptsView;
