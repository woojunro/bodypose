import React from 'react';
import './ReviewCard.css';
import { GetStars } from '../../functions/Reviews/ReviewFunctions';
import { Link } from 'react-router-dom';

const ReviewCard = ({ reviewContent, currentStudio = null }) => {
  const reviewText = reviewContent.text;
  const linkTo = '/reviews/' + reviewContent.id;

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
    <Link
      to={linkTo}
      style={{ decoder: 'none', color: 'white' }}
      className="reviewLink"
      onClick={() => {
        window.scrollTo(0, 0);
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
    </Link>
  );
};
export default ReviewCard;
