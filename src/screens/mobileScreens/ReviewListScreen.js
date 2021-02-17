import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { REVIEW_SORTING_OPTIONS } from '../../components/mobileComponents/ReviewList/SortOptions';
import {
  GetReviews,
  GetMoreReview,
} from '../../components/functions/WithDb/Review';
import SortButton from '../../components/mobileComponents/ReviewList/SortButton';
import './ReviewListScreen.css';
import ReviewScrollView from '../../components/mobileComponents/ReviewList/ReviewScrollView';
import Modal from '../../components/mobileComponents/ReviewList//SortbyModal';

const ReviewListScreen = () => {
  let sortByOptions = REVIEW_SORTING_OPTIONS;

  const [sortBy, setSortBy] = useState(sortByOptions[0]);
  const [isThereMoreReviews, setIsThereMoreReviews] = useState(true);
  const [Reviews, setReviews] = useState([]);
  const [isSortByOpen, setIsSortByOpen] = useState(false);

  const closeModal = () => {
    setIsSortByOpen(false);
  };
  const GetMore = () => {
    const more = Reviews.concat(GetMoreReview());
    if (more.length === Reviews.length) {
      setIsThereMoreReviews(false);
    }
    setReviews(more);
  };

  useEffect(() => {
    setReviews(GetReviews(sortBy.optionName));
  }, [sortBy]);
  useEffect(() => {
    document.body.style.overflow = isSortByOpen ? 'hidden' : 'auto';
  }, [isSortByOpen]);

  const history = useHistory();
  return (
    <div>
      <div className="reviewListTopContainer">
        <FiArrowLeft
          className="usersGoBackArrow"
          onClick={() => {
            history.goBack();
          }}
        />
        <div className="leaveTitle">리뷰모아보기</div>
        <div className="usersTopEmptyBox" />
      </div>
      <div style={{ width: '100%', height: '50px' }} />
      <div className="reviewSortButtonContainer">
        <SortButton
          isOpen={isSortByOpen}
          open={() => setIsSortByOpen(true)}
          close={() => setIsSortByOpen(false)}
          selectedOption={sortBy}
        />
      </div>
      <Modal
        isOpen={isSortByOpen}
        close={closeModal}
        closeSortBy={() => setIsSortByOpen(false)}
        options={sortByOptions}
        setOption={setSortBy}
        selectedOption={sortBy}
      />
      <div className="reviewPart">
        <ReviewScrollView reviewList={Reviews} />
      </div>
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

export default ReviewListScreen;
