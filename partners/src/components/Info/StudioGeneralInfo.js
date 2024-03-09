import React from 'react';
import GeneralInfoItem from './GeneralInfoItem';
import SetLink from './SetLink';

const GeneralInfo = ({
  studioName,
  currentContactLink,
  contactLink,
  setContactLink,
  currentReservationLink,
  reservationLink,
  setReservationLink,
}) => (
  <div className="fullSizeBox">
    <div className="boxTitle">기본 정보</div>
    <div className="generalInfoContainer">
      <GeneralInfoItem title="스튜디오 이름" item={studioName} />
      <SetLink
        title="문의 링크"
        currentLink={currentContactLink}
        link={contactLink}
        setLink={setContactLink}
      />
      <SetLink
        title="예약 링크"
        currentLink={currentReservationLink}
        link={reservationLink}
        setLink={setReservationLink}
      />
    </div>
  </div>
);

export default GeneralInfo;
