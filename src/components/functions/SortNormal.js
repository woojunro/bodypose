//노멀 스튜디오만 소팅하는 함수.
import { DbPremium } from '../../virtualDB/items/DbPremium';

const SortPremium = (studios) => {
  var normalStudioList = [];
  studios.map((studio) => {
    if (!DbPremium.includes(studio.title)) normalStudioList.push(studio);
    return null;
  });
  return normalStudioList;
};

export default SortPremium;
