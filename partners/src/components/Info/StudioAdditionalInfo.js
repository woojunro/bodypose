import React from 'react';
import AutoHeightTextarea from '../AutoHeightTextarea';

const StudioAdditionalInfo = ({
  description = '',
  setDescription = () => {},
  reservation = '',
  setReservation = () => {},
  cancel = '',
  setCancel = () => {},
}) => (
  <div className="fullSizeBox">
    <div className="boxTitle">추가 정보</div>
    <div className="generalInfoContainer">
      <div className="infoItemContainer">
        <div className="infoItemTitle">스튜디오 소개</div>
        <AutoHeightTextarea value={description} setValue={setDescription} />
      </div>
      <div className="infoItemContainer">
        <div className="infoItemTitle">예약 안내</div>
        <AutoHeightTextarea value={reservation} setValue={setReservation} />
      </div>
      <div className="infoItemContainer">
        <div className="infoItemTitle">예약 변경/환불 규정</div>
        <AutoHeightTextarea value={cancel} setValue={setCancel} />
      </div>
    </div>
  </div>
);

export default StudioAdditionalInfo;
