import React from 'react';
import StudioCard from './StudioCard';
import './StudioListView.css';

const StudioListView = ({ studioList, isHeartView = false }) => {
  const renderedStudioList = studioList.map(studio => {
    return (
      <div key={`heartStudio-${studio.id}`} className="insideBox">
        <StudioCard
          id={studio.id}
          Hearted={studio.isHearted}
          name={studio.slug}
          title={studio.name}
          price={studio.lowestPrice}
          location={studio.branches.length > 0 && studio.branches[0].address}
          rating={studio.totalRating / studio.reviewCount}
          mainPhoto={studio.coverPhoto ? studio.coverPhoto.originalUrl : null}
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
