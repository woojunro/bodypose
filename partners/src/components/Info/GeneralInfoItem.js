import React from 'react';
import './GeneralInfoItem.css';

const GeneralInfoItem = ({ title, item, changeText, onClick }) => {
  return (
    <div className="infoItemContainer">
      <div className="infoItemTitle">{title}</div>
      <div>{item}</div>
      <div className="changeText" onClick={onClick}>
        {changeText}
      </div>
    </div>
  );
};

export default GeneralInfoItem;
