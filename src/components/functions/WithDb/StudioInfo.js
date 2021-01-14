import {
  DbBalanceButton,
  BalanceButtonPhoto,
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
