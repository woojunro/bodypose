//프리미엄 스튜디오만 소팅하는 함수.
import { DbPremium } from '../../virtualDB/items/DbPremium';

const SortPremium = (studios) => {
  var premiumStudioList = [];
  studios.map((studio) => {
    if (DbPremium.includes(studio.title)) premiumStudioList.push(studio);
    return null;
  });
  return premiumStudioList;
};

export default SortPremium;
