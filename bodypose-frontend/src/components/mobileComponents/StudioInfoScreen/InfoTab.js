import React from 'react';
import './InfoTab.css';
import InfoToggleDiv from './InfoToggleDiv';
import StudioMap from './StudioMap';

const InfoTab = ({ currentStudio }) => {
  const {
    name,
    branches,
    info: { description, reservation, cancel },
  } = currentStudio;

  return (
    <div className="infoTab">
      {description && (
        <InfoToggleDiv title="스튜디오 소개" content={description} />
      )}
      <StudioMap branches={branches} studioName={name} />
      {reservation && <InfoToggleDiv title="예약안내" content={reservation} />}
      {cancel && (
        <InfoToggleDiv
          openDefault={false}
          title="예약변경 및 예약취소"
          content={cancel}
        />
      )}
    </div>
  );
};
export default InfoTab;
