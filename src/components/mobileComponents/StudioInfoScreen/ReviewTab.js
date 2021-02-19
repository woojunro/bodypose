import React, { useState, useEffect, useContext } from 'react';
import './ReviewTab.css';
import SortButton from '../../mobileComponents/ReviewList/SortButton';
import { REVIEW_SORTING_OPTIONS } from '../../mobileComponents/ReviewList/SortOptions';
import ReviewScrollView from '../../mobileComponents/ReviewList/ReviewScrollView';
import LoginContext from '../../../contexts/LoginContext';
import { useHistory } from 'react-router-dom';
import Modal from '../ReviewList/SortbyModal';
import { useQuery } from '@apollo/client';
import { STUDIO_REVIEWS_QUERY } from '../../../gql/queries/StudioReviewQuery';
import { MY_PROFILE_QUERY } from '../../../gql/queries/MyProfileQuery';
import LoadingIcon from '../conceptListScreen/LoadingIcon';
import { clearTokenAndCache } from '../../../apollo';
import WriteReview from '../ReviewList/WriteReview';

const ReviewTab = ({ currentStudio, refetchStudio }) => {
  const LoggedIn = useContext(LoginContext);
  const history = useHistory();

  const { data: profileData, loading: profileLoading } = useQuery(
    MY_PROFILE_QUERY,
    {
      onError: () => {
        if (LoggedIn.loggedIn) {
          clearTokenAndCache();
          LoggedIn.setLoggedIn(false);
        }
      },
    }
  );

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(REVIEW_SORTING_OPTIONS[0]);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(false);

  const { data, loading, fetchMore, refetch } = useQuery(STUDIO_REVIEWS_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      page: 1,
      studioSlug: currentStudio.slug,
      order: sortBy.optionName,
    },
  });

  const closeModal = () => {
    setIsSortByOpen(false);
  };

  const GetMore = async () => {
    setFetchMoreLoading(true);
    await fetchMore({
      variables: {
        page: page + 1,
        studioSlug: currentStudio.slug,
        order: sortBy.optionName,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          ...prev,
          studioReviews: {
            ...prev.studioReviews,
            studioReviews: [
              ...prev.studioReviews.studioReviews,
              ...fetchMoreResult.studioReviews.studioReviews,
            ],
          },
        });
      },
    });
    setPage(page + 1);
    setFetchMoreLoading(false);
  };

  useEffect(() => {
    document.body.style.overflow = isWriteReviewOpen ? 'hidden' : 'auto';
  }, [isWriteReviewOpen]);

  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  return (
    <div>
      {isWriteReviewOpen && (
        <WriteReview
          studioName={currentStudio.slug}
          studioTitle={currentStudio.name}
          isWriteReviewOpen={isWriteReviewOpen}
          setIsWriteReviewOpen={setIsWriteReviewOpen}
          refetchReviews={refetch}
          refetchStudio={refetchStudio}
        />
      )}
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
            if (LoggedIn.loggedIn) {
              if (!profileData.myProfile?.profile.isVerified) {
                alert(
                  '이메일 가입 회원은 이메일 인증 후 후기 작성이 가능합니다.'
                );
                return;
              }
              setIsWriteReviewOpen(true);
            } else {
              const ok = window.confirm(
                '로그인이 필요한 기능입니다. 로그인 하시겠습니까?'
              );
              if (!ok) return;
              history.push({
                pathname: '/login',
                state: { previousPath: `/studios/${currentStudio.slug}` },
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
        options={REVIEW_SORTING_OPTIONS}
        setOption={setSortBy}
        selectedOption={sortBy}
      />
      <div className="reviewTab">
        {data?.studioReviews && (
          <ReviewScrollView
            reviewList={data.studioReviews.studioReviews}
            currentStudio={currentStudio}
          />
        )}
        {loading || profileLoading || fetchMoreLoading ? (
          <div className="seeMoreReviewContainer">
            <LoadingIcon />
          </div>
        ) : page < data.studioReviews.totalPages ? (
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
      </div>
    </div>
  );
};
export default ReviewTab;
