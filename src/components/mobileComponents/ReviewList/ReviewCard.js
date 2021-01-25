import React from 'react';
import './ReviewCard.css';
import { GetStars } from '../../functions/Reviews/ReviewFunctions';
import { Link } from 'react-router-dom';

const ReviewCard = ({ reviewContent }) => {
  const reviewText = reviewContent.text;
  const linkTo = '/reviews/' + reviewContent.number;

  const renderedbottomPart = () => {
    if (reviewContent.pic) {
      return (
        <div className="reviewBottomPart">
          <div className="reviewThumb">
            <img src={reviewContent.thumb} alt="reviewPhoto" />
            {reviewContent.pic.length > 1 ? (
              <div className="reviewPhotoNum">1/{reviewContent.pic.length}</div>
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
          <div className="reviewUserName">{reviewContent.userName}</div>
          <div className="reviewInfo">
            <div className="ratingAndStudio">
              <div className="reviewrating">
                {GetStars(reviewContent.rating)}
              </div>
              <div className="reviewStudio">{reviewContent.studioTitle}</div>
            </div>
            <div className="reviewDate">{reviewContent.timestamp}</div>
          </div>
        </div>
        {renderedbottomPart()}
      </div>
    </Link>
  );
};
export default ReviewCard;
