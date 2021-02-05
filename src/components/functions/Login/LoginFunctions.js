export const CheckValidEmail = email => {
  var check = false;
  if (email.includes('@') && email.includes('.')) {
    const atIndex = email.indexOf('@');
    const emailPart = email.slice(0, atIndex);
    const dotIndex = email.indexOf('.');
    const comPart = email.slice(dotIndex + 1, email.length + 1);
    if (/^[0-9a-zA-Z]+$/.test(emailPart) && /^[0-9a-zA-Z]+$/.test(comPart)) {
      check = true;
    } else {
      check = false;
    }
  } else {
    check = false;
  }
  return check;
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
