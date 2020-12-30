import React from 'react';
import Man1 from '../../../materials/Man1.jpg';
import Man2 from '../../../materials/Man2.jpg';
import Man3 from '../../../materials/Man3.jpg';
import Man4 from '../../../materials/Man4.jpg';
import MainConceptsView from './MainConceptsView';

const ManConcepts = () => {
  const ConceptsList = [
    {
      pic: Man1,
      number: 5,
    },
    {
      pic: Man2,
      number: 6,
    },
    {
      pic: Man3,
      number: 7,
    },
    {
      pic: Man4,
      number: 8,
    },
  ];

  return (
    <MainConceptsView
      ConceptsList={ConceptsList}
      semiTitle="취향저격 남성 컨셉 추천"
    />
  );
};

export default ManConcepts;
