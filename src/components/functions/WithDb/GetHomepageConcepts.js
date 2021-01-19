import aavec16 from '../../../virtualDB/images/AAVEC16.jpg';
import aavec26 from '../../../virtualDB/images/AAVEC26.jpg';
import coco27 from '../../../virtualDB/images/Coco27.jpg';
import Flyn29 from '../../../virtualDB/images/Flyn29.jpg';

import coco22 from '../../../virtualDB/images/Coco22.jpg';
import balanceButton4 from '../../../virtualDB/images/Balance Button4.jpg';
import Flyn28 from '../../../virtualDB/images/Flyn28.jpg';
import Flyn12 from '../../../virtualDB/images/Flyn12.jpg';

import balanceButton34 from '../../../virtualDB/images/Balance Button34.jpg';
import Flyn5 from '../../../virtualDB/images/Flyn5.jpg';
import balanceButton38 from '../../../virtualDB/images/Balance Button38.jpg';
import balanceButton83 from '../../../virtualDB/images/Balance Button83.jpg';

//메인 홈페이지 남성 컨셉 4개 불러오기.
export const GetMaleConcepts = () => {
  return [
    {
      photoName: 'aavec16',
      studio: 'aavec',
      sex: 'male',
      title: '아베크',
      horizon: false,
      attribute: ['흑백사진', '하의', '기타도구', '소가구'],
      pic: aavec16,
      thumb: aavec16,
    },
    {
      photoName: 'aavec26',
      studio: 'aavec',
      title: '아베크',

      sex: 'male',
      horizon: false,
      attribute: ['컬러', '언더웨어', '도구없음'],
      pic: aavec26,
      thumb: aavec26,
    },
    {
      photoName: 'cocoViking27',
      studio: 'cocoViking',
      title: '코코바이킹',

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
      title: '플린',

      horizon: false,
      attribute: ['흑백사진', '언더웨어', '도구없음'],
      pic: Flyn29,
      thumb: Flyn29,
    },
  ];
};

export const GetFemaleConcepts = () => {
  return [
    {
      photoName: 'cocoViking22',
      studio: 'cocoViking',
      sex: 'female',
      horizon: false,
      title: '코코바이킹',

      attribute: ['컬러', '하의', '도구없음'],
      pic: coco22,
      thumb: coco22,
    },
    {
      photoName: 'flyn28',
      studio: 'flyn',
      sex: 'female',
      horizon: false,
      title: '플린',

      attribute: ['화이트/블랙', '컨셉', '수영복', '소가구'],
      pic: Flyn28,
      thumb: Flyn28,
    },
    {
      photoName: 'balanceButton4',
      studio: 'balanceButton',
      sex: 'female',
      title: '밸런스버튼',

      horizon: false,
      attribute: ['컬러', '상의', '도구없음'],
      pic: balanceButton4,
      thumb: balanceButton4,
    },
    {
      photoName: 'flyn12',
      studio: 'flyn',
      title: '플린',

      sex: 'female',
      horizon: false,
      attribute: ['화이트/블랙', '컨셉', '언더웨어', '가구없음'],
      pic: Flyn12,
      thumb: Flyn12,
    },
  ];
};

export const GetCoupleConcepts = () => {
  return [
    {
      photoName: 'balanceButton34',
      studio: 'balanceButton',
      title: '밸런스버튼',

      sex: 'male',
      horizon: false,
      attribute: ['컬러', '하의', '소가구', '기타도구', '소도구', '단체'],
      pic: balanceButton34,
      thumb: balanceButton34,
    },
    {
      photoName: 'flyn5',
      studio: 'flyn',
      title: '플린',

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
      title: '밸런스버튼',

      horizon: false,
      attribute: ['컬러', '하의', '소도구', '기타도구'],
      pic: balanceButton38,
      thumb: balanceButton38,
    },
    {
      photoName: 'balanceButton83',
      studio: 'balanceButton',
      sex: 'female',
      title: '밸런스버튼',

      horizon: false,
      attribute: ['컬러', '수영복', '도구없음', '단체'],
      pic: balanceButton83,
      thumb: balanceButton83,
    },
  ];
};
