import React from 'react';
import { STUDIO_LOCATION_OPTIONS } from './SortingOptions';
import StudioCard from './StudioCard';
import './StudioListView.css';

const StudioListView = ({
  studioList,
  isHeartView = false,
  selectedLocation = STUDIO_LOCATION_OPTIONS[0],
}) => {
  const getValidBranch = (branches = []) => {
    if (!branches.length) return null;
    if (selectedLocation.name === 'default') return branches[0];
    return branches.find(branch =>
      branch.address.startsWith(selectedLocation.name)
    );
  };

  const renderedStudioList = studioList.map(studio => {
    const validBranch = getValidBranch(studio.branches);
    return (
      <div key={`heartStudio-${studio.id}`} className="insideBox">
        <StudioCard
          id={studio.id}
          Hearted={studio.isHearted}
          name={studio.slug}
          title={studio.name}
          price={studio.lowestPrice}
          location={validBranch?.address}
          // rating={studio.totalRating / studio.reviewCount}
          mainPhoto={studio.coverPhotoUrl}
          review={studio.reviewCount}
          isEvent={false}
          originalPrice={0}
          percent={0}
        />
      </div>
    );
  });
  return (
    <div>
      {isHeartView ? null : <div className="semiTitle"></div>}
      <div className="listScrollView">{renderedStudioList}</div>
    </div>
  );
};
export default StudioListView;
