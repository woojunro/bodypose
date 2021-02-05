import React, { useContext, useState, useEffect } from 'react';
import './FullReviewScreen.css';
import {
  GetFullReview,
  RemoveReview,
} from '../../components/functions/WithDb/Review';
import { GetUserName } from '../../components/functions/WithDb/User';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { GetStars } from '../../components/functions/Reviews/ReviewFunctions';
import ReviewBody from '../../components/mobileComponents/ReviewList/ReviewBody';
import { BsThreeDotsVertical } from 'react-icons/bs';
import ReportModal from '../../components/mobileComponents/ReviewList/ReportModal';
import RemoveModal from '../../components/mobileComponents/ReviewList/RemoveModal';

import ToStudioButton from '../../components/mobileComponents/ReviewList/ToStudioButton';
import ReviewOption from '../../components/mobileComponents/ReviewList/ReviewOption';

import LoginContext from '../../contexts/LoginContext';
const FullReviewScreen = ({ match }) => {
  const LoggedIn = useContext(LoginContext);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isSameUser, setIsSameUser] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const history = useHistory();
  const number = match.params.reviewNumber;
  const fullReview = GetFullReview(Number(number));
  const studioName = fullReview.studioName;
  const linkTo = '/studios/' + studioName;

  console.log(linkTo);

  useEffect(() => {
    if (LoggedIn.loggedIn) {
      const currentUser = GetUserName();
      if (currentUser === fullReview.userName) {
        setIsSameUser(true);
      }
    }
  }, []);

  return (
    <div>
      <ReportModal
        currentReview={fullReview.number}
        close={() => setIsReportOpen(false)}
        isOpen={isReportOpen}
      />
      <RemoveModal
        currentReview={fullReview.number}
        close={() => setIsRemoveOpen(false)}
        isOpen={isRemoveOpen}
        history={history}
      />

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
        <BsThreeDotsVertical
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setIsOptionOpen(!isOptionOpen);
          }}
        />
        {isOptionOpen ? (
          <ReviewOption
            reviewNumber={fullReview.number}
            isSameUser={isSameUser}
            setIsOptionOpen={setIsOptionOpen}
            setIsReportOpen={setIsReportOpen}
            setIsRemoveOpen={setIsRemoveOpen}
          />
        ) : null}
      </div>
      <div className="fullReviewBottomPart">
        <ReviewBody currentReview={fullReview} />
        <ToStudioButton linkTo={linkTo} />
      </div>
    </div>
  );
};

export default FullReviewScreen;
