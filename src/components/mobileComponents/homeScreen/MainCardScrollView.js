import React from 'react';
import MainCardM from './MainCardM';
import './MainCardScrollView.css';
import SemiTitle from './SemiTitle';
import SortingStudioFunction from '../../functions/Studio/SortingStudioFunc';
import SeeMoreArrow from './SeeMoreArrow';
import {
  STUDIO_LOCATION_OPTIONS,
  STUDIO_SORT_OPTIONS,
} from '../studioListScreen/SortingOptions';

const MainCardScrollView = ({ studios }) => {
  const renderedStudio = SortingStudioFunction(
    STUDIO_SORT_OPTIONS[0],
    STUDIO_LOCATION_OPTIONS[0],
    '',
    studios
  )
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
    <div>
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
