import {
  DbBalanceButton,
  BalanceButtonPhoto,
  BalanceButtonIndoorPrice,
  BalanceButtonOutdoorPrice,
  BalanceButtonHairMakeup,
  BalanceButtonOptionProduct,
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

export const GetIndoorItem = (currentStudio) => {
  if (currentStudio === 'balance-button') {
    return BalanceButtonIndoorPrice;
  }
};
export const GetOutdoorItem = (currentStudio) => {
  if (currentStudio === 'balance-button') {
    return BalanceButtonOutdoorPrice;
  }
};

export const GetHairMakeup = (currentStudio) => {
  if (currentStudio === 'balance-button') {
    return BalanceButtonHairMakeup;
  }
};

export const GetOptionProduct = (currentStudio) => {
  if (currentStudio === 'balance-button') {
    return BalanceButtonOptionProduct;
  }
};
