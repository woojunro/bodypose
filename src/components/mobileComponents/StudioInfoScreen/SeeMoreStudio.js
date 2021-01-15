import React from 'react';
import StudioCard from './StudioCard';
import './SeeMoreStudio.css';
import Shuffle from '../../functions/Shuffle';

import { GetStudios } from '../../functions/WithDb/GetStudios';
import { SortSeeMore } from '../../functions/Studio/SortingFunctions';

const SeeMoreStudio = (currentStudioName) => {
  //Db에서 스튜디오 불러오는 부분.
  let studios = GetStudios();
  //프리미엄 스튜디오 순서 섞고 6개만 추출.

  var premiumStudioList = SortSeeMore(studios, currentStudioName);
  Shuffle(premiumStudioList);

  premiumStudioList = premiumStudioList.slice(0, 6);

  const renderedStudio = premiumStudioList.map((studio) => {
    return (
      <li key={studio.studioName}>
        <StudioCard
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
      <div className="seeMoreStudio">스튜디오 더 둘러보기</div>
      <span className="mainScrollView">
        <ul>{renderedStudio}</ul>
      </span>
    </div>
  );
};

export default SeeMoreStudio;
