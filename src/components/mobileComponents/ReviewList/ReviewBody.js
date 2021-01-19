import React, { useState } from 'react';
import './ReviewBody.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const ReviewBody = ({ currentReview }) => {
  const [currentPic, setCurrentPic] = useState(0);

  const renderedText = currentReview.text.split('\n').map((line) => {
    return (
      <span key={line}>
        {line}
        <br />
      </span>
    );
  });
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
      <div className="reviewBodyPhoto">
        {renderedArrows()}
        {currentReview.pic ? (
          <img alt="reviewPhoto" src={currentReview.pic[currentPic]} />
        ) : null}
      </div>
      <div className="reviewBodyText">{renderedText}</div>
    </div>
  );
};
export default ReviewBody;
