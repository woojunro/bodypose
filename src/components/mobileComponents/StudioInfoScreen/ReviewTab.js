import React, { useState, useEffect } from 'react';
import './ReviewTab.css';
import { GetReview, GetMoreReview } from '../../functions/WithDb/StudioInfo';
import SortButton from '../../mobileComponents/ReviewList/SortButton';
import { SortOptions } from '../../mobileComponents/ReviewList/SortOptions';
import ReviewScrollView from '../../mobileComponents/ReviewList/ReviewScrollView';

const ReviewTab = ({ currentStudio }) => {
  let sortByOptions = SortOptions;

  const [sortBy, setSortBy] = useState(sortByOptions[0]);
  const [isThereMoreReviews, setIsThereMoreReviews] = useState(true);
  const [Reviews, setReviews] = useState([]);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const GetMore = () => {
    const more = Reviews.concat(
      GetMoreReview(currentStudio.studioName, sortBy.optionName)
    );
    if (more.length === Reviews.length) {
      setIsThereMoreReviews(false);
    }
    setReviews(more);
  };
  useEffect(() => {
    setReviews(GetReview(currentStudio.studioName, sortBy.optionName));
  }, [sortBy]);

  useEffect(() => {
    document.body.style.overflow = isSortByOpen ? 'hidden' : 'auto';
  }, [isSortByOpen]);
  return (
    <div className="reviewTab">
      <div className="reviewTabTopContainer">
        <div>
          <SortButton
            isOpen={isSortByOpen}
            open={() => setIsSortByOpen(true)}
            close={() => setIsSortByOpen(false)}
            options={sortByOptions}
            setOption={setSortBy}
            selectedOption={sortBy}
          />
        </div>
        <div className="writeReview">+ 리뷰 쓰기</div>
      </div>
      <ReviewScrollView reviewList={Reviews} />

      {isThereMoreReviews ? (
        <div className="seeMoreReviewContainer">
          <div className="seeMoreReview" onClick={() => GetMore()}>
            리뷰 더보기
          </div>
        </div>
      ) : (
        <div className="seeMoreReviewContainer">모든 리뷰를 불러왔습니다.</div>
      )}
    </div>
  );
};
export default ReviewTab;
