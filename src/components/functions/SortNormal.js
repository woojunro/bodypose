//노멀 스튜디오만 소팅하는 함수.

const SortPremium = (studios) => {
  var normalStudioList = [];
  studios.map((studio) => {
    if (studio.premium === '0') normalStudioList.push(studio);
    return null;
  });
  return normalStudioList;
};

export default SortPremium;
