import Shuffle from './Shuffle';
const MakingConceptListArray = (conceptList) => {
  Shuffle(conceptList);
  var arrayList = [];
  const length = Math.floor(conceptList.length / 3);
  var i = 0;

  while (i < length) {
    if (i + 1 === length) {
      arrayList.push(conceptList.slice(3 * i, conceptList.length));
    } else {
      arrayList.push(conceptList.slice(3 * i, 3 * i + 3));
    }

    i++;
  }
  return arrayList;
};

export default MakingConceptListArray;
