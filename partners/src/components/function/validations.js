export const validatePhoneNumber = (phoneNumber = '') => {
  return /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/.test(phoneNumber);
};
