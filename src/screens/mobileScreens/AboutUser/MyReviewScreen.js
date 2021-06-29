import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory, Redirect } from 'react-router-dom';
import ReviewScrollView from '../../../components/mobileComponents/ReviewList/ReviewScrollView';
import { useQuery, useReactiveVar } from '@apollo/client';
import { MY_STUDIO_REVIEWS_QUERY } from '../../../gql/queries/StudioReviewQuery';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';
import FullReviewScreen from '../FullReviewScreen';
import { MY_PROFILE_QUERY } from '../../../gql/queries/MyProfileQuery';

import './MyReviewScreen.css';
import { IsLoggedInVar } from '../../../apollo';

const MyReviewScreen = () => {
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const history = useHistory();

  const [isReviewDetailOpen, setIsReviewDetailOpen] = useState(false);
  const [reviewDetailId, setReviewDetailId] = useState(-1);

  const { data, loading, refetch } = useQuery(MY_STUDIO_REVIEWS_QUERY, {
    fetchPolicy: 'network-only',
  });

  const { data: profileData, loading: profileLoading } =
    useQuery(MY_PROFILE_QUERY);

  const openReviewDetail = id => {
    setReviewDetailId(id);
    setIsReviewDetailOpen(true);
  };

  const closeReviewDetail = () => {
    setIsReviewDetailOpen(false);
    setReviewDetailId(-1);
  };

  const refetchReviews = () => {
    refetch();
    setIsReviewDetailOpen(false);
    setReviewDetailId(-1);
  };

  if (!isLoggedIn) {
    return <Redirect to={'/error'} />;
  }
  return (
    <div>
      {data?.myStudioReviews?.studioReviews &&
        data.myStudioReviews.studioReviews.length > 0 &&
        isReviewDetailOpen && (
          <FullReviewScreen
            id={reviewDetailId}
            nickname={profileData?.userProfile?.profile?.nickname}
            close={closeReviewDetail}
            refetchReviews={refetchReviews}
          />
        )}
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
      {loading || profileLoading ? (
        <div className="appLoader">
          <AppLoadingScreen />
        </div>
      ) : (
        <div className="myStudioReviewsContainer">
          {data?.myStudioReviews &&
            (data.myStudioReviews.studioReviews.length > 0 ? (
              <ReviewScrollView
                reviewList={data?.myStudioReviews?.studioReviews}
                openReviewDetail={openReviewDetail}
              />
            ) : (
              <div className="appLoader">
                <p>아직 작성한 리뷰가 없어요.</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MyReviewScreen;
