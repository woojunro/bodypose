const autoHyphenPhoneNumber = (phoneNumber = '') => {
  phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

  const result = [];
  let restNumber = '';

  // 지역번호와 나머지 번호로 나누기
  if (phoneNumber.startsWith('02')) {
    // 서울 02 지역번호
    result.push(phoneNumber.substr(0, 2));
    restNumber = phoneNumber.substring(2);
  } else if (phoneNumber.startsWith('1')) {
    // 지역 번호가 없는 경우
    // 1xxx-yyyy
    restNumber = phoneNumber;
  } else {
    // 나머지 3자리 지역번호
    // 0xx-yyyy-zzzz
    result.push(phoneNumber.substr(0, 3));
    restNumber = phoneNumber.substring(3);
  }

  if (restNumber.length === 7) {
    // 7자리만 남았을 때는 xxx-yyyy
    result.push(restNumber.substring(0, 3));
    result.push(restNumber.substring(3));
  } else {
    result.push(restNumber.substring(0, 4));
    result.push(restNumber.substring(4));
  }

  return result.filter(val => val).join('-');
};

export default autoHyphenPhoneNumber;
