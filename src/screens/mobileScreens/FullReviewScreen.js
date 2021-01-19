import React, { useContext, useState } from 'react';
import './FullReviewScreen.css';
import { GetFullReview } from '../../components/functions/WithDb/Review';
import { GetUserName } from '../../components/functions/WithDb/User';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { GetStars } from '../../components/functions/Reviews/ReviewFunctions';
import ReviewBody from '../../components/mobileComponents/ReviewList/ReviewBody';
import { BsThreeDotsVertical } from 'react-icons/bs';
import ToStudioButton from '../../components/mobileComponents/ReviewList/ToStudioButton';

import LoginContext from '../../contexts/LoginContext';
const FullReviewScreen = ({ match }) => {
  const LogedIn = useContext(LoginContext);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isSameUser, setIsSameUser] = useState(false);
  const history = useHistory();
  const number = match.params.reviewNumber;
  const fullReview = GetFullReview(Number(number));
  const linkTo = fullReview.studioName;

  if (LogedIn.logedIn) {
    const currentUser = GetUserName();
    if (currentUser === fullReview.userName) {
      setIsSameUser(true);
    }
  }

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
        <BsThreeDotsVertical />
      </div>
      <div className="fullReviewBottomPart">
        <ReviewBody currentReview={fullReview} />
        <ToStudioButton studioName={fullReview.studioName} />
      </div>
    </div>
  );
};

export default FullReviewScreen;
