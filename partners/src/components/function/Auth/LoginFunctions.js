export const CheckValidEmail = email => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const CheckValidPassword = password => {
  return /^(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(password);
};

export const CheckValidStudioName = studioName => {
  var check = false;

  if (
    /^[0-9a-zA-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/.test(studioName) &&
    CheckValidStudioName.length < 15
  ) {
    check = true;
  } else check = false;

  return check;
};
