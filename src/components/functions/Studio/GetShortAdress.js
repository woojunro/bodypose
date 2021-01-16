const GetShortAdress = (adress) => {
  const stringArray = adress.split(' ');
  const string = stringArray[0] + ' ' + stringArray[1] + ' ' + stringArray[2];

  return string;
};
export default GetShortAdress;
