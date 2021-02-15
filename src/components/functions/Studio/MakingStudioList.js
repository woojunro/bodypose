import '../../../virtualDB/items/DbStudios';
import { SortPremium, SortNormal } from './SortingFunctions';
import Shuffle from '../Shuffle';
//프리미엄 스튜디오를 상위, 노멀 스튜디오를 하위에 놓는 함수.

export const MakingStudioList = studioList => {
  const premiumStudioList = SortPremium(studioList);
  const normalStudioList = SortNormal(studioList);
  const shuffledPremiums = Shuffle(premiumStudioList);
  const shuffledNormals = Shuffle(normalStudioList);

  return shuffledPremiums.concat(shuffledNormals);
};
