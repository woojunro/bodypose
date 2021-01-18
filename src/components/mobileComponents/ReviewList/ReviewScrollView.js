import React from 'react';
import ReviewCard from './ReviewCard';

const ReviewScrollView = ({ reviewList }) => {
  const renderedReviewScroll = reviewList.map((review) => {
    return <ReviewCard key={review.text} reviewContent={review} />;
  });

  return <div>{renderedReviewScroll}</div>;
};
export default ReviewScrollView;
