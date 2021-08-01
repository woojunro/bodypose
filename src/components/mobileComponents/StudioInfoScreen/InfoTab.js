import React from 'react';
import './InfoTab.css';
import InfoToggleDiv from './InfoToggleDiv';
import StudioMap from './StudioMap';

const InfoTab = ({ currentStudio }) => {
  return (
    <div className="infoTab">
      <StudioMap branches={currentStudio.branches} />
      {currentStudio.parkingInfoDescription && (
        <InfoToggleDiv
          title="주차 정보"
          content={currentStudio.parkingInfoDescription}
        />
      )}
      {currentStudio.reservationInfoDescription && (
        <InfoToggleDiv
          title="예약안내"
          content={currentStudio.reservationInfoDescription}
        />
      )}
      {currentStudio.cancelInfoDescription && (
        <InfoToggleDiv
          openDefault={false}
          title="예약변경 및 예약취소"
          content={currentStudio.cancelInfoDescription}
        />
      )}
    </div>
  );
};
export default InfoTab;
