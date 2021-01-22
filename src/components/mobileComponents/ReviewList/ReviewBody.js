import React, { useState } from 'react';
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

  const renderedArrows = () => {
    return (
      <>
        {currentReview.pic && currentPic > 0 ? (
          <div className="prevPicContainer">
            <IoIosArrowBack onClick={() => GetPrevPic()} className="prevPic" />
          </div>
        ) : null}

        {currentReview.pic && currentPic < currentReview.pic.length - 1 ? (
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
      {currentReview.pic ? (
        <div className="reviewBodyPhoto">
          {renderedArrows()}
          <img alt="reviewPhoto" src={currentReview.pic[currentPic]} />
        </div>
      ) : null}
      <div className="reviewBodyText">{currentReview.text}</div>
    </div>
  );
};
export default ReviewBody;
