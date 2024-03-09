export const CONFIRM_INFO_UPDATE = (info = '') => {
  const DEFAULT_MESSAGE = '정보가 업데이트됩니다. 계속하시겠습니까?';
  return (info && info + ' ') + DEFAULT_MESSAGE;
};

export const CONFIRM_PHOTO_DELETION =
  '삭제된 사진은 복구가 불가능합니다.\n사진을 삭제하시겠습니까?';
