import React, { useState } from 'react';
import StudioCard from './StudioCard';
import './SeeMoreStudio.css';
import SortingStudioFunction from '../../functions/Studio/SortingStudioFunc';
import {
  STUDIO_LOCATION_OPTIONS,
  STUDIO_SORT_OPTIONS,
} from '../studioListScreen/SortingOptions';

const SeeMoreStudio = ({ currentStudioName, studioList }) => {
  const [studiosToBeRendered] = useState(
    SortingStudioFunction(
      STUDIO_SORT_OPTIONS[0],
      STUDIO_LOCATION_OPTIONS[0],
      '',
      studioList
    )
      .filter(studio => studio.name !== currentStudioName)
      .slice(0, 4)
  );

  const renderedStudio = studiosToBeRendered.map(studio => {
    return (
      <li key={`seeMore-${studio.slug}`}>
        <StudioCard
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
      <div className="seeMoreStudio">
        <b>스튜디오 더 둘러보기</b>
      </div>
      <span className="mainScrollView">
        <ul>{renderedStudio}</ul>
      </span>
    </div>
  );
};

export default SeeMoreStudio;
