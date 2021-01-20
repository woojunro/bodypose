import {
  DbBalanceButton,
  BalanceButtonPhoto,
  BalanceButtonIndoorPrice,
  BalanceButtonOutdoorPrice,
  BalanceButtonHairMakeup,
  BalanceButtonOptionProduct,
  BalanceButtonReviews,
} from '../../../virtualDB/items/DbBalanceButtton';

//개별 studio 정보 불러오는 함수
export const GetStudioInfo = (currentStudio) => {
  if (currentStudio === 'balance-button') {
    return DbBalanceButton;
  }
};

//개별 studio의 사진들 불러오는 함수
export const GetStudioPhoto = (currentStudio) => {
  if (currentStudio === 'balance-button') {
    return BalanceButtonPhoto.slice(0, 24);
  }
};

//studio의 추가 사진 불러오는 함수
export const GetMorePhoto = (currentStudio, i, currentData) => {
  if (currentStudio === 'balance-button') {
    return currentData.concat(BalanceButtonPhoto.slice(i + 24, i + 48));
  }
};
//내부 상품 불러오는 함수.
export const GetIndoorItem = (currentStudio) => {
  if (currentStudio === 'balance-button') {
    return BalanceButtonIndoorPrice;
  }
};
//외부 상품 불러오는 함수.
export const GetOutdoorItem = (currentStudio) => {
  if (currentStudio === 'balance-button') {
    return BalanceButtonOutdoorPrice;
  }
};
//헤어 메이크업 상품 불러오는 함수.
export const GetHairMakeup = (currentStudio) => {
  if (currentStudio === 'balance-button') {
    return BalanceButtonHairMakeup;
  }
};

//추가상품 불러오는 함수.
export const GetOptionProduct = (currentStudio) => {
  if (currentStudio === 'balance-button') {
    return BalanceButtonOptionProduct;
  }
};
//초기 리뷰 불러오는 함수.
export const GetReview = (currentStudio, option) => {
  if (currentStudio === 'balance-button') {
    return BalanceButtonReviews.slice(0, 5);
  }
};
//리뷰 추가적으로 불러오는 함수.
export const GetMoreReview = (currentStudio, option) => {
  if (currentStudio === 'balance-button') {
    return BalanceButtonReviews.slice(10, 15);
  }
};
