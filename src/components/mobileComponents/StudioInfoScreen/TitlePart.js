import React from 'react';
import './TitlePart.css';

const FixedPart = ({ currentStudio }) => {
  return (
    <>
      <div className="studioInfoTitleContainer">
        <img src={currentStudio.logoUrl} alt="logo" className="studioLogo" />
        <div className="stuioInfoTitle">{currentStudio.name}</div>
      </div>
    </>
  );
};

export default FixedPart;
