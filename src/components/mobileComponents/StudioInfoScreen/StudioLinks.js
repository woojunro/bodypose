import React from 'react';
import './StudioLinks.css';

const StudioLinks = ({ currentStudio, onContactClick }) => {
  const openInNewTab = url => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div className="linksContainer">
      <div className="linksBox">
        <div
          className="contactLink"
          onClick={() => {
            onContactClick('CONTACT');
            openInNewTab(currentStudio.info.contactUrl);
          }}
        >
          스튜디오 문의
        </div>
        <div
          className="reservationLink"
          onClick={() => {
            onContactClick('RESERVATION');
            openInNewTab(currentStudio.info.reservationUrl);
          }}
        >
          스튜디오 예약
        </div>
      </div>
    </div>
  );
};
export default StudioLinks;
