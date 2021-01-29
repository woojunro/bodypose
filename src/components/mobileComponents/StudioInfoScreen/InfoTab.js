import React from 'react';
import './InfoTab.css';
import './StudioMap';
import Parking from './Parking';
import StudioMap from './StudioMap';

const InfoTab = ({ currentStudio }) => {
  return (
    <div className="infoTab">
      <StudioMap currentStudio={currentStudio} />
      <Parking currentStudio={currentStudio} />
    </div>
  );
};
export default InfoTab;
