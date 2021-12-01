import React from 'react';
import MainCardM from './MainCardM';
import './MainCardScrollView.css';
import SemiTitle from './SemiTitle';
import { MakingStudioList } from '../../functions/Studio/MakingStudioList';
import SeeMoreArrow from './SeeMoreArrow';

const MainCardScrollView = ({ studios }) => {
  const renderedStudio = MakingStudioList(studios)
    .slice(0, 6)
    .map(studio => {
      return (
        <li key={`MainCardM-${studio.slug}`}>
          <MainCardM
            studioName={studio.slug}
            pic={studio.coverPhotoUrl}
            price={studio.lowestPrice}
            title={studio.name}
          />
        </li>
      );
    });

  return (
    <div className="mainContainer">
      <SemiTitle title="추천 스튜디오" pageTo="/studios" />
      <span className="mainScrollView">
        <ul>
          {renderedStudio}
          <li>
            <SeeMoreArrow />
          </li>
        </ul>
      </span>
    </div>
  );
};

export default MainCardScrollView;
