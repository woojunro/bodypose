const autoHyphenBusinessNumber = (businessNumber = '') => {
  const num = businessNumber.replace(/[^0-9]/g, '');
  let tmp = '';

  if (num.length < 4) {
    return num;
  } else if (num.length < 6) {
    tmp += num.substr(0, 3);
    tmp += '-';
    tmp += num.substr(3);
    return tmp;
  } else {
    tmp += num.substr(0, 3);
    tmp += '-';
    tmp += num.substr(3, 2);
    tmp += '-';
    tmp += num.substr(5);
    return tmp;
  }
};

export default autoHyphenBusinessNumber;
