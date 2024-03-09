export const isEmailValid = email => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const isPasswordValid = password => {
  return /^(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(password);
};
