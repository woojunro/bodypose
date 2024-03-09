import React from 'react';
import './PageTitle.css';

const NameContainer = ({ title, subtitle }) => {
  return (
    <div className="pageNameContainer">
      <div className="pageName">
        <div>{title}</div>
        <div className="pageSubtitle">{subtitle}</div>
      </div>
    </div>
  );
};

export default NameContainer;
