import React from 'react';
import './InfoTab.css';
import './StudioMap';
import StudioMap from './StudioMap';

const InfoTab = ({ currentStudio }) => {
  return (
    <div className="infoTab">
      <StudioMap currentStudio={currentStudio} />
    </div>
  );
};
export default InfoTab;
