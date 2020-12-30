import React from 'react';
import balanceButton34 from '../../../virtualDB/images/Balance Button34.jpg';
import Flyn5 from '../../../virtualDB/images/Flyn5.jpg';
import balanceButton38 from '../../../virtualDB/images/Balance Button38.jpg';
import balanceButton83 from '../../../virtualDB/images/Balance Button83.jpg';
import MainConceptsView from './MainConceptsView';

const CoupleConcepts = () => {
  const ConceptsList = [
    {
      photoName: 'balanceButton34',
      studio: 'balanceButton',
      sex: 'male',
      horizon: false,
      attribute: ['컬러', '하의', '소가구', '기타도구', '소도구', '단체'],
      pic: balanceButton34,
      thumb: balanceButton34,
    },
    {
      photoName: 'flyn5',
      studio: 'flyn',
      sex: 'couple',
      horizon: false,
      attribute: ['컬러', '하의', '소가구', '단체'],
      pic: Flyn5,
      thumb: Flyn5,
    },
    {
      photoName: 'balanceButton38',
      studio: 'balanceButton',
      sex: 'couple',
      horizon: false,
      attribute: ['컬러', '하의', '소도구', '기타도구'],
      pic: balanceButton38,
      thumb: balanceButton38,
    },
    {
      photoName: 'balanceButton83',
      studio: 'balanceButton',
      sex: 'female',
      horizon: false,
      attribute: ['컬러', '수영복', '도구없음', '단체'],
      pic: balanceButton83,
      thumb: balanceButton83,
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
