import React, { useState } from 'react';
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

const FullReviewScreen = ({
  id,
  nickname,
  close,
  currentStudioName = null,
  refetchReviews = () => {},
  refetchStudio = () => {},
}) => {
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

  return (
    <div className="writeReview">
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
      <div className="fullReviewBottomPart">
        <ReviewBody currentReview={review} />
        {!currentStudioName && (
          <ToStudioButton linkTo={`/studios/${review.studio.slug}`} />
        )}
      </div>
    </div>
  );
};

export default FullReviewScreen;
