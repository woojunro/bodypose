export const alertError = (message = null) => {
  if (message) {
    alert(message);
  } else {
    alert('오류가 발생하였습니다. 다시 시도해주세요.');
  }
};
