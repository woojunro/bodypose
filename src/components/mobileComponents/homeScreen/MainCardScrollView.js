import React from 'react';
import MainCardM from './MainCardM';
import './MainCardScrollView.css';
import Shuffle from '../../functions/Shuffle';
import SemiTitle from './SemiTitle';

import { GetStudios } from '../../functions/WithDb/GetStudios';
import { SortPremium } from '../../functions/Studio/SortingFunctions';

const MainCardScrollView = () => {
  //Db에서 스튜디오 불러오는 부분.
  let studios = GetStudios();
  //프리미엄 스튜디오 순서 섞고 5개만 추출.

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
