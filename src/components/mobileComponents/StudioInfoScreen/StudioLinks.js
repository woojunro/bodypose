import React from 'react';
import './StudioLinks.css';

const StudioLinks = ({ currentStudio }) => {
  return (
    <div className="linksContainer">
      <div className="linksBox">
        <td
          className="contactLink"
          onClick={() => window.open(`${currentStudio.contactLink}`, '_blank')}
        >
          스튜디오 문의
        </td>
        <td
          className="reservationLink"
          onClick={() =>
            window.open(`${currentStudio.reservationLink}`, '_blank')
          }
        >
          스튜디오 예약
        </td>
      </div>
    </div>
  );
};
export default StudioLinks;
