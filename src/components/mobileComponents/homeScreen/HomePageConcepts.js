import React, { useState } from 'react';
import MainConceptsView from './MainConceptsView';
import shuffle from '../../functions/Shuffle';

export const MaleConcepts = ({ concepts }) => {
  const [shuffledConcepts] = useState(shuffle(concepts));

  return (
    <MainConceptsView
      ConceptsList={shuffledConcepts}
      semiTitle="취향저격 남성 컨셉 추천"
    />
  );
};

export const FemaleConcepts = ({ concepts }) => {
  const [shuffledConcepts] = useState(shuffle(concepts));

  return (
    <MainConceptsView
      ConceptsList={shuffledConcepts}
      semiTitle="취향저격 여성 컨셉 추천"
    />
  );
};

export const CoupleConcepts = ({ concepts }) => {
  const [shuffledConcepts] = useState(shuffle(concepts));

  return (
    <MainConceptsView
      ConceptsList={shuffledConcepts}
      semiTitle="알콩달콩 커플 컨셉 추천"
    />
  );
};
