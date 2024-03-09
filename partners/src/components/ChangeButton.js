import React from 'react';
import './ChangeButton.css';

const ChangeButton = ({ buttonName, onClick, isActive = true, isGray }) => {
  return isActive ? (
    <div className="ChangeButtonContainer" onClick={onClick}>
      <div className={isGray ? 'GrayButton' : 'ChangeButton'}>{buttonName}</div>
    </div>
  ) : (
    <div className="ChangeButtonContainerUnactive">
      <div className="ChangeButtonUnactive">{buttonName}</div>
    </div>
  );
};

export default ChangeButton;
