import React from 'react';
import {
  GetMaleConcepts,
  GetFemaleConcepts,
  GetCoupleConcepts,
} from '../../functions/WithDb/GetHomepageConcepts';
import MainConceptsView from './MainConceptsView';

export const MaleConcepts = () => {
  const ConceptsList = GetMaleConcepts();

  return (
    <MainConceptsView
      ConceptsList={ConceptsList}
      semiTitle="취향저격 남성 컨셉 추천"
    />
  );
};

export const FemaleConcepts = ({ concepts }) => {
  const ConceptsList = GetFemaleConcepts();

  return (
    <MainConceptsView
      ConceptsList={ConceptsList}
      semiTitle="취향저격 여성 컨셉 추천"
    />
  );
};

export const CoupleConcepts = () => {
  const ConceptsList = GetCoupleConcepts();

  return (
    <MainConceptsView
      ConceptsList={ConceptsList}
      semiTitle="알콩달콩 커플 컨셉 추천"
    />
  );
};
