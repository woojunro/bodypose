import React from 'react';
import './MenuBarName.css';

const StudioName = ({ studioName }) => {
  return (
    <div className="menuBarStudioName">
      <div>{studioName}</div>
    </div>
  );
};
export default StudioName;
