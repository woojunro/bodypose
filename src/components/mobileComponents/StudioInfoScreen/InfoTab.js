import React from 'react';
import './InfoTab.css';
import InfoToggleDiv from './InfoToggleDiv';
import './StudioMap';
import StudioMap from './StudioMap';

const InfoTab = ({ currentStudio }) => {
  return (
    <div className="infoTab">
      <StudioMap currentStudio={currentStudio} />
      {currentStudio.parkingInfoDescription && (
        <InfoToggleDiv
          title="주차 정보"
          content={currentStudio.parkingInfoDescription}
        />
      )}
      {currentStudio.reservationInfoDescription && (
        <InfoToggleDiv
          title="예약 정보"
          content={currentStudio.reservationInfoDescription}
        />
      )}
      {currentStudio.cancelInfoDescription && (
        <InfoToggleDiv
          title="예약 변경 및 환불 정보"
          content={currentStudio.cancelInfoDescription}
        />
      )}
    </div>
  );
};
export default InfoTab;
