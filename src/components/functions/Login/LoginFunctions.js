export const CheckValidEmail = email => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const CheckValidPassword = password => {
  var check = false;

  if (
    /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9a-zA-Z]*$/.test(password) &&
    password.length > 7 &&
    /^(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(password)
  ) {
    check = true;
  } else {
    check = false;
  }
  return check;
};

export const CheckValidUserName = userName => {
  var check = false;

  if (
    /^[0-9a-zA-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/.test(userName) &&
    userName.length < 11
  ) {
    check = true;
  } else check = false;

  return check;
};
