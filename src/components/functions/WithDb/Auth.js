//이메일과 비밀번호 확인하는 함수.
export const CheckEmailPassword = () => {
  return true;
};

//이메일로 로그인 하는 함수.
export const Login = (email, password) => {
  return console.log('로그인 됐다잇');
};
//Sns로 로그인 하는 함수.
export const SnsLogin = () => {
  return console.log('SNS 로그인됨');
};
//로그아웃하는 함수.
export const Logout = () => {
  return console.log('로그아웃 됐다잇');
};
//회원정보 삭제하는 함수.
export const Leave = () => {
  return console.log('회원탈퇴다잇.');
};
//이메일로 가입하면 이메일 가입 정보 db에 저장하는 함수
export const EmailToDb = (email, password, userName) => {
  console.log(email, password, userName);
};
//sns로 가입하면 sns 가입 정보 db에 저장하는 함수
export const SnsToDb = (userName) => {
  console.log(userName);
};
//이미 존재하는 이메일인지 확인.
export const CheckAlreadyUsedEmail = (email) => {
  return false;
};
//이미 존재하는 유저 네임인지 확인.
export const CheckAlreadyUsedUserName = (userName) => {
  return false;
};

//비밀번호 변경을 위한 이메일 확인 함수.
export const CheckCorrectEmail = (email) => {
  return true;
};
