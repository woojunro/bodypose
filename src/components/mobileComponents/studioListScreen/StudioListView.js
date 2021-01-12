import React from 'react';
import StudioCard from './StudioCard';
import './StudioListView.css';

const StudioListView = ({ studioList, isHeartView = false }) => {
  const renderedStudioList = studioList.map((studio) => {
    return (
      <div key={studio.title} className="insideBox">
        <StudioCard
          Hearted={studio.isHearted}
          name={studio.studioName}
          title={studio.title}
          price={studio.price}
          location={studio.location}
          rating={studio.rating}
          mainPhoto={studio.mainPhoto}
          hearts={studio.hearts}
          review={studio.review}
          isEvent={studio.isEvent}
          originalPrice={studio.originalPrice}
          percent={studio.percent}
        />
      </div>
    );
  });
  return (
    <div>
      {isHeartView ? null : <div className="semiTitle">프리미엄 스튜디오</div>}
      <div className="listScrollView">{renderedStudioList}</div>
    </div>
  );
};
export default StudioListView;
