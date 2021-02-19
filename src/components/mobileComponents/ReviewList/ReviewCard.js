import React from 'react';
import './ReviewCard.css';
import { GetStars } from '../../functions/Reviews/ReviewFunctions';

const ReviewCard = ({
  reviewContent,
  openReviewDetail,
  currentStudio = null,
}) => {
  const reviewText = reviewContent.text;

  const renderedbottomPart = () => {
    if (!reviewContent.isPhotoForProof) {
      return (
        <div className="reviewBottomPart">
          <div className="reviewThumb">
            <img
              src={
                reviewContent.photos.filter(
                  photo => photo.id === reviewContent.thumbnailPhotoId
                )[0].url
              }
              alt="reviewPhoto"
            />
            {!reviewContent.isPhotoForProof ? (
              <div className="reviewPhotoNum">
                1/{reviewContent.photos.length}
              </div>
            ) : null}
          </div>
          <div className="reviewText">{reviewText}</div>
        </div>
      );
    } else {
      return (
        <div className="reviewBottomPart">
          <div>
            <div className="reviewText">{reviewText}</div>
            <div></div>
          </div>
        </div>
      );
    }
  };
  return (
    <div
      className="reviewLink"
      onClick={() => {
        openReviewDetail(reviewContent.id);
      }}
    >
      <div className="reviewCardContainer">
        <div className="reviewTopPart">
          <div className="reviewUserName">{reviewContent.user.nickname}</div>
          <div className="reviewInfo">
            <div className="ratingAndStudio">
              <div className="reviewrating">
                {GetStars(reviewContent.rating)}
              </div>
              <div className="reviewStudio">
                {currentStudio ? '' : reviewContent.studio.name}
              </div>
            </div>
            <div className="reviewDate">
              {reviewContent.createdAt.split('T')[0]}
            </div>
          </div>
        </div>
        {renderedbottomPart()}
      </div>
    </div>
  );
};
export default ReviewCard;
