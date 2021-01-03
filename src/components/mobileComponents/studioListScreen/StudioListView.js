import React from 'react';
import StudioCard from './StudioCard';
import './StudioListView.css';
import '../../../virtualDB/items/DbStudios';

const StudioListView = ({ studioList }) => {
  const renderedStudioList = studioList.map((studio) => {
    return (
      <div key={studio.title}>
        <StudioCard
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
      <div className="semiTitle">프리미엄 스튜디오</div>
      <div className="listScrollView">{renderedStudioList}</div>
    </div>
  );
};
export default StudioListView;
