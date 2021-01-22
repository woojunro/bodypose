import React, { useState, useEffect, useContext } from 'react';
import './ReviewTab.css';
import { GetReview, GetMoreReview } from '../../functions/WithDb/StudioInfo';
import SortButton from '../../mobileComponents/ReviewList/SortButton';
import { SortOptions } from '../../mobileComponents/ReviewList/SortOptions';
import ReviewScrollView from '../../mobileComponents/ReviewList/ReviewScrollView';
import LoginContext from '../../../contexts/LoginContext';
import { useHistory } from 'react-router-dom';
import Modal from '../ReviewList/SortbyModal';

const ReviewTab = ({ currentStudio, setIsWriteReviewOpen }) => {
  let sortByOptions = SortOptions;
  const LogedIn = useContext(LoginContext);
  const history = useHistory();

  const [sortBy, setSortBy] = useState(sortByOptions[0]);
  const [isThereMoreReviews, setIsThereMoreReviews] = useState(true);
  const [Reviews, setReviews] = useState([]);
  const [isSortByOpen, setIsSortByOpen] = useState(false);

  const closeModal = () => {
    setIsSortByOpen(false);
  };
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

  return (
    <div>
      <div className="reviewTabTopContainer">
        <div>
          <SortButton
            isOpen={isSortByOpen}
            open={() => setIsSortByOpen(true)}
            close={() => setIsSortByOpen(false)}
            selectedOption={sortBy}
          />
        </div>

        <div
          className="writeReviewButton"
          onClick={() => {
            if (LogedIn.logedIn) {
              setIsWriteReviewOpen(true);
            } else {
              history.push({
                pathname: '/login',
                state: { previousPath: `/studios/${currentStudio.studioName}` },
              });
            }
          }}
        >
          + 리뷰 쓰기
        </div>
      </div>
      <Modal
        isOpen={isSortByOpen}
        close={closeModal}
        closeSortBy={() => setIsSortByOpen(false)}
        options={sortByOptions}
        setOption={setSortBy}
        selectedOption={sortBy}
      />
      <div className="reviewTab">
        <ReviewScrollView reviewList={Reviews} />

        {isThereMoreReviews ? (
          <div className="seeMoreReviewContainer">
            <div className="seeMoreReview" onClick={() => GetMore()}>
              리뷰 더보기
            </div>
          </div>
        ) : (
          <div className="seeMoreReviewContainer">
            모든 리뷰를 불러왔습니다.
          </div>
        )}
      </div>
    </div>
  );
};
export default ReviewTab;
