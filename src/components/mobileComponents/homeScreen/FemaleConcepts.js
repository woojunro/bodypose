import React from 'react';

import coco22 from '../../../virtualDB/images/Coco22.jpg';
import balanceButton4 from '../../../virtualDB/images/Balance Button4.jpg';
import Flyn28 from '../../../virtualDB/images/Flyn28.jpg';
import Flyn12 from '../../../virtualDB/images/Flyn12.jpg';

import MainConceptsView from './MainConceptsView';

const WomanConcepts = () => {
  const ConceptsList = [
    {
      photoName: 'cocoViking22',
      studio: 'cocoViking',
      sex: 'female',
      horizon: false,
      attribute: ['컬러', '하의', '도구없음'],
      pic: coco22,
      thumb: coco22,
    },
    {
      photoName: 'flyn28',
      studio: 'flyn',
      sex: 'female',
      horizon: false,
      attribute: ['화이트/블랙', '컨셉', '수영복', '소가구'],
      pic: Flyn28,
      thumb: Flyn28,
    },
    {
      photoName: 'balanceButton4',
      studio: 'balanceButton',
      sex: 'female',
      horizon: false,
      attribute: ['컬러', '상의', '도구없음'],
      pic: balanceButton4,
      thumb: balanceButton4,
    },
    {
      photoName: 'flyn12',
      studio: 'flyn',
      sex: 'female',
      horizon: false,
      attribute: ['화이트/블랙', '컨셉', '언더웨어', '가구없음'],
      pic: Flyn12,
      thumb: Flyn12,
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
