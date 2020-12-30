import React from 'react';
import Couple1 from '../../../materials/Couple1.jpg';
import Couple2 from '../../../materials/Couple2.jpg';
import Couple3 from '../../../materials/Couple3.jpg';
import Couple4 from '../../../materials/Couple4.jpg';
import MainConceptsView from './MainConceptsView';

const CoupleConcepts = () => {
  const ConceptsList = [
    {
      pic: Couple1,
      number: 9,
    },
    {
      pic: Couple2,
      number: 10,
    },
    {
      pic: Couple3,
      number: 11,
    },
    {
      pic: Couple4,
      number: 12,
    },
  ];

  return (
    <MainConceptsView
      ConceptsList={ConceptsList}
      semiTitle="알콩달콩 커플 컨셉 추천"
    />
  );
};

export default CoupleConcepts;
