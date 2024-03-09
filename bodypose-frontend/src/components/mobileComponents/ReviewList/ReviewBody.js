import React, { useEffect, useState } from 'react';
import './ReviewBody.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const ReviewBody = ({ currentReview }) => {
  const [currentPic, setCurrentPic] = useState(0);

  const GetNextPic = () => {
    setCurrentPic(currentPic + 1);
  };
  const GetPrevPic = () => {
    setCurrentPic(currentPic - 1);
  };

  useEffect(() => {
    if (currentReview.thumbnailPhotoId) {
      setCurrentPic(
        currentReview.photos.findIndex(
          photo => currentReview.thumbnailPhotoId === photo.id
        )
      );
    }
  }, []);

  const renderedArrows = () => {
    return (
      <>
        {currentReview.photos.length > 0 && currentPic > 0 ? (
          <div className="prevPicContainer">
            <IoIosArrowBack onClick={() => GetPrevPic()} className="prevPic" />
          </div>
        ) : null}

        {currentReview.photos.length > 0 &&
        currentPic < currentReview.photos.length - 1 ? (
          <div className="nextPicContainer">
            <IoIosArrowForward
              onClick={() => GetNextPic()}
              className="nextPic"
            />
          </div>
        ) : null}
      </>
    );
  };

  return (
    <div className="reviewBody">
      {currentReview.photos.length > 0 ? (
        <div className="reviewBodyPhoto">
          {renderedArrows()}
          <img alt="reviewPhoto" src={currentReview.photos[currentPic].url} />
        </div>
      ) : null}
      <div className="reviewBodyText">{currentReview.text}</div>
    </div>
  );
};
export default ReviewBody;
