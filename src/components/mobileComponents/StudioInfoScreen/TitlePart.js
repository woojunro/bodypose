import React from 'react';
import './TitlePart.css';

const FixedPart = ({ currentStudio }) => {
  return (
    <>
      <div className="studioInfoTitleContainer">
        <img src={currentStudio.logo} alt="logo" />
        <div className="stuioInfoTitle">{currentStudio.title}</div>
      </div>
    </>
  );
};

export default FixedPart;
