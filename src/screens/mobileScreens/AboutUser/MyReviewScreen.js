import React, { useContext } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory, Redirect } from 'react-router-dom';
import LoginContext from '../../../contexts/LoginContext';

import { GetUserReview } from '../../../components/functions/WithDb/User';
import ReviewScrollView from '../../../components/mobileComponents/ReviewList/ReviewScrollView';

const MyReviewScreen = () => {
  const LoggedIn = useContext(LoginContext);

  const history = useHistory();
  const myReviews = GetUserReview();
  if (!LoggedIn.loggedIn) {
    return <Redirect to={'/error'} />;
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
        <div className="leaveTitle">내가 쓴 리뷰</div>
        <div className="usersTopEmptyBox" />
      </div>
      <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <ReviewScrollView reviewList={myReviews} />
      </div>
    </div>
  );
};

export default MyReviewScreen;
