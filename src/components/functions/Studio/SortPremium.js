//프리미엄 스튜디오만 소팅하는 함수.

const SortPremium = (studios) => {
  var premiumStudioList = [];
  studios.map((studio) => {
    if (studio.premium === '1') premiumStudioList.push(studio);
    return null;
  });
  return premiumStudioList;
};

export default SortPremium;
