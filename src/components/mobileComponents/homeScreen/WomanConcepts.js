import React from 'react';
import Woman1 from '../../../materials/Woman1.jpg';
import Woman2 from '../../../materials/Woman2.jpg';
import Woman3 from '../../../materials/Woman3.jpg';
import Woman4 from '../../../materials/Woman4.jpg';
import MainConceptsView from './MainConceptsView';

const WomanConcepts = () => {
  const ConceptsList = [
    {
      pic: Woman1,
      number: 1,
    },
    {
      pic: Woman2,
      number: 2,
    },
    {
      pic: Woman3,
      number: 3,
    },
    {
      pic: Woman4,
      number: 4,
    },
  ];

  return (
    <MainConceptsView
      ConceptsList={ConceptsList}
      semiTitle="취향저격 여성 컨셉 추천"
    />
  );
};

export default WomanConcepts;
