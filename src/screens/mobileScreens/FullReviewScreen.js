import React from 'react';
import './FullReviewScreen.css';
import { GetFullReview } from '../../components/functions/WithDb/Review';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { GetStars } from '../../components/functions/Reviews/ReviewFunctions';

const FullReviewScreen = ({ match }) => {
  const history = useHistory();
  const number = match.params.reviewNumber;
  const fullReview = GetFullReview(Number(number));
  const linkTo = fullReview.studioName;
  return (
    <div>
      <div className="usersTopContainer">
        <FiArrowLeft
          className="usersGoBackArrow"
          onClick={() => {
            history.goBack();
          }}
        />
        <div className="leaveTitle">{fullReview.studioTitle}</div>
        <div className="usersTopEmptyBox" />
      </div>
      <div className="fullReviewTopPart">
        <div className="fullReviewLeftPart">
          <div className="fullReviewUserName">{fullReview.userName}</div>

          <div className="fullratingAndStudio">
            <div className="fullReviewrating">
              {GetStars(fullReview.rating)}
            </div>
            <div className="fullReviewStudio">{fullReview.timestamp}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullReviewScreen;
