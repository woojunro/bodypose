//프리미엄 스튜디오를 상위, 노멀 스튜디오를 하위에 놓는 함수.
import '../../virtualDB/items/DbStudios';
import SortPremium from './SortPremium';
import SortNormal from './SortNormal';
import Shuffle from './Shuffle';

export const MakingStudioList = (studioList) => {
  let originalStudios = studioList;
  var premiumStudioList = SortPremium(originalStudios);
  var normalStudioList = SortNormal(originalStudios);
  Shuffle(premiumStudioList);
  Shuffle(normalStudioList);
  var studios = premiumStudioList.concat(normalStudioList);

  return studios;
};
