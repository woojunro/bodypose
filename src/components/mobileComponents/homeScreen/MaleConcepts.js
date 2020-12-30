import React from 'react';
import aavec16 from '../../../virtualDB/images/AAVEC16.jpg';
import aavec26 from '../../../virtualDB/images/AAVEC26.jpg';
import coco27 from '../../../virtualDB/images/Coco27.jpg';
import Flyn29 from '../../../virtualDB/images/Flyn29.jpg';
import MainConceptsView from './MainConceptsView';

const ManConcepts = () => {
  const ConceptsList = [
    {
      photoName: 'aavec16',
      studio: 'aavec',
      sex: 'male',
      horizon: false,
      attribute: ['흑백사진', '하의', '기타도구', '소가구'],
      pic: aavec16,
      thumb: aavec16,
    },
    {
      photoName: 'aavec26',
      studio: 'aavec',
      sex: 'male',
      horizon: false,
      attribute: ['컬러', '언더웨어', '도구없음'],
      pic: aavec26,
      thumb: aavec26,
    },
    {
      photoName: 'cocoViking27',
      studio: 'cocoViking',
      sex: 'male',
      horizon: false,
      attribute: ['컬러', '하의', '기타도구'],
      pic: coco27,
      thumb: coco27,
    },
    {
      photoName: 'flyn29',
      studio: 'flyn',
      sex: 'male',
      horizon: false,
      attribute: ['흑백사진', '언더웨어', '도구없음'],
      pic: Flyn29,
      thumb: Flyn29,
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
