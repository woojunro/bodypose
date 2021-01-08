import React from 'react';
import MainCardM from './MainCardM';
import './MainCardScrollView.css';
import Shuffle from '../../functions/Shuffle';
import SemiTitle from './SemiTitle';

import { DbStudios } from '../../../virtualDB/items/DbStudios';
import SortPremium from '../../functions/Studio/SortPremium';

const MainCardScrollView = () => {
  //프리미엄 스튜디오 순서 섞고 5개만 추출.
  let studios = DbStudios;
  var premiumStudioList = SortPremium(studios);
  Shuffle(premiumStudioList);

  premiumStudioList = premiumStudioList.slice(0, 5);

  const renderedStudio = premiumStudioList.map((studio) => {
    return (
      <li key={studio.studioName}>
        <MainCardM
          studioName={studio.studioName}
          pic={studio.mainPhoto}
          price={studio.price}
          title={studio.title}
        />
      </li>
    );
  });

  return (
    <div>
      <SemiTitle title="추천 스튜디오" pageTo="/studios" />
      <span className="mainScrollView">
        <ul>{renderedStudio}</ul>
      </span>
    </div>
  );
};

export default MainCardScrollView;
