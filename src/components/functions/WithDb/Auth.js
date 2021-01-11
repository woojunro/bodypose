export const Login = () => {
  return console.log('로그인 됐다잇');
};

export const SnsLogin = () => {
  return console.log('SNS 로그인됨');
};

export const EmailToDb = (email, password, userName) => {
  console.log(email, password, userName);
};

export const SnsToDb = (userName) => {
  console.log(userName);
};

export const CheckAlreadyUsedEmail = (email) => {
  return false;
};
export const CheckAlreadyUsedUserName = (userName) => {
  return false;
};
