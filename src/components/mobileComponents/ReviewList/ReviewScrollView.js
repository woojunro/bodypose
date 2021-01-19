import React from 'react';
import ReviewCard from './ReviewCard';

const ReviewScrollView = ({ reviewList }) => {
  const renderedReviewScroll = reviewList.map((review) => {
    return (
      <div key={review.userName + review.studioTitle}>
        <ReviewCard reviewContent={review} />
      </div>
    );
  });

  return <>{renderedReviewScroll}</>;
};
export default ReviewScrollView;
