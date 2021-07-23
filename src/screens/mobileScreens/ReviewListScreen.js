import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import './ReviewListScreen.css';
import ReviewScrollView from '../../components/mobileComponents/ReviewList/ReviewScrollView';
import { useQuery } from '@apollo/client';
import { ALL_STUDIO_REVIEWS_QUERY } from '../../gql/queries/StudioReviewQuery';
import { useHistory } from 'react-router-dom';
import { MY_PROFILE_QUERY } from '../../gql/queries/MyProfileQuery';
import FullReviewScreen from './FullReviewScreen';
import LoadingIcon from '../../components/mobileComponents/conceptListScreen/LoadingIcon';

const ReviewListScreen = () => {
  const history = useHistory();
  const { data, loading, fetchMore, refetch } = useQuery(
    ALL_STUDIO_REVIEWS_QUERY,
    {
      fetchPolicy: 'network-only',
      variables: {
        page: 1,
      },
    }
  );
  const { data: profileData, loading: profileLoading } =
    useQuery(MY_PROFILE_QUERY);

  const [page, setPage] = useState(1);
  const [isReviewDetailOpen, setIsReviewDetailOpen] = useState(false);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(false);
  const [reviewDetailId, setReviewDetailId] = useState(-1);

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

  const GetMore = async () => {
    setFetchMoreLoading(true);
    await fetchMore({
      variables: {
        page: page + 1,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          ...prev,
          allStudioReviews: {
            ...prev.allStudioReviews,
            studioReviews: [
              ...prev.allStudioReviews.studioReviews,
              ...fetchMoreResult.allStudioReviews.studioReviews,
            ],
          },
        });
      },
    });
    setPage(page + 1);
    setFetchMoreLoading(false);
  };

  return (
    <div>
      {data?.allStudioReviews?.studioReviews &&
      data.allStudioReviews.studioReviews.length > 0 &&
      isReviewDetailOpen ? (
        <FullReviewScreen
          id={reviewDetailId}
          nickname={profileData?.myProfile?.profile.nickname}
          close={closeReviewDetail}
          refetchReviews={refetchReviews}
        />
      ) : (
        <>
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
          <div className="reviewPart">
            {data?.allStudioReviews && (
              <ReviewScrollView
                reviewList={data?.allStudioReviews?.studioReviews}
                openReviewDetail={openReviewDetail}
              />
            )}
          </div>
          {loading || profileLoading || fetchMoreLoading ? (
            <div className="seeMoreReviewContainer">
              <LoadingIcon />
            </div>
          ) : page < data.allStudioReviews.totalPages ? (
            <div className="seeMoreReviewContainer">
              <div className="seeMoreReview" onClick={GetMore}>
                리뷰 더보기
              </div>
            </div>
          ) : (
            <div className="seeMoreReviewContainer">
              모든 리뷰를 불러왔습니다.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewListScreen;
