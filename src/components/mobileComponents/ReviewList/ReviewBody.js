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

  return (
    <div className="reviewBody">
      <div className="reviewBodyPhoto">
        <img alt="reviewPhoto" src={currentReview.pic[0]} />
      </div>
      <div className="reviewBodyText">{renderedText}</div>
    </div>
  );
};
export default ReviewBody;
