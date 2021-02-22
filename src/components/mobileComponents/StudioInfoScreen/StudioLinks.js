import React from 'react';
import './StudioLinks.css';

const StudioLinks = ({ currentStudio }) => {
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div className="linksContainer">
      <div className="linksBox">
        <div
          className="contactLink"
          onClick={() => openInNewTab(currentStudio.contactUrl)}
        >
          스튜디오 문의
        </div>
        <div
          className="reservationLink"
          onClick={() => openInNewTab(currentStudio.reservationUrl)}
        >
          스튜디오 예약
        </div>
      </div>
    </div>
  );
};
export default StudioLinks;
