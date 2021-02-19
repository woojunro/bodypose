import React from 'react';
import ReviewCard from './ReviewCard';

const ReviewScrollView = ({
  reviewList,
  openReviewDetail,
  currentStudio = null,
}) => {
  const renderedReviewScroll = reviewList.map(review => {
    return (
      <div key={`studioReview-${review.id}`}>
        <ReviewCard
          reviewContent={review}
          currentStudio={currentStudio}
          openReviewDetail={openReviewDetail}
        />
      </div>
    );
  });

  return <>{renderedReviewScroll}</>;
};
export default ReviewScrollView;
