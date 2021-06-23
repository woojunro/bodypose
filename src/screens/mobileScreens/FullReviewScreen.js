import React, { useEffect, useState } from 'react';
import './FullReviewScreen.css';
import { FiArrowLeft } from 'react-icons/fi';
import { GetStars } from '../../components/functions/Reviews/ReviewFunctions';
import ReviewBody from '../../components/mobileComponents/ReviewList/ReviewBody';
import { BsThreeDotsVertical } from 'react-icons/bs';
import ReportModal from '../../components/mobileComponents/ReviewList/ReportModal';
import RemoveModal from '../../components/mobileComponents/ReviewList/RemoveModal';

import ToStudioButton from '../../components/mobileComponents/ReviewList/ToStudioButton';
import ReviewOption from '../../components/mobileComponents/ReviewList/ReviewOption';
import { client } from '../../apollo';
import { gql } from '@apollo/client';
import ReactGA from 'react-ga';

const FullReviewScreen = ({
  id,
  nickname,
  close,
  currentStudioName = null,
  refetchReviews = () => {},
  refetchStudio = () => {},
}) => {
  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const fragment = currentStudioName
    ? gql`
        fragment reviewFragment on UsersReviewStudios {
          id
          createdAt
          rating
          text
          thumbnailPhotoId
          isPhotoForProof
          photos {
            id
            url
          }
          user {
            nickname
          }
        }
      `
    : gql`
        fragment reviewFragmentWithStudio on UsersReviewStudios {
          id
          createdAt
          rating
          text
          thumbnailPhotoId
          isPhotoForProof
          photos {
            id
            url
          }
          user {
            nickname
          }
          studio {
            name
            slug
          }
        }
      `;

  const review = client.readFragment({
    id: `UsersReviewStudios:${id}`,
    fragment,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="writeReview">
      <div className="reviewContainer">
        <ReportModal
          currentReview={review.id}
          close={() => setIsReportOpen(false)}
          isOpen={isReportOpen}
        />
        <RemoveModal
          currentReview={review.id}
          close={() => setIsRemoveOpen(false)}
          closeDetail={close}
          isOpen={isRemoveOpen}
          refetchReviews={refetchReviews}
          refetchStudio={refetchStudio}
        />

        <div className="usersTopContainer">
          <FiArrowLeft className="usersGoBackArrow" onClick={close} />
          <div className="leaveTitle">
            {currentStudioName ? currentStudioName : review.studio.name}
          </div>
          <div className="usersTopEmptyBox" />
        </div>
        <div className="fullReviewTopPart">
          <div className="fullReviewLeftPart">
            <div className="fullReviewUserName">{review.user.nickname}</div>

            <div className="fullratingAndStudio">
              <div className="fullReviewrating">{GetStars(review.rating)}</div>
              <div className="fullReviewStudio">
                {review.createdAt.split('T')[0]}
              </div>
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
              reviewNumber={review.id}
              isSameUser={nickname === review.user.nickname}
              setIsOptionOpen={setIsOptionOpen}
              setIsReportOpen={setIsReportOpen}
              setIsRemoveOpen={setIsRemoveOpen}
            />
          ) : null}
        </div>
        <div className="fullReviewBodyPart">
          <ReviewBody currentReview={review} />
        </div>
        <div className="fullReviewBottomPart">
          {!currentStudioName && (
            <ToStudioButton linkTo={`/studios/${review.studio.slug}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FullReviewScreen;
