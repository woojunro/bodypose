import React from 'react';
import './LeaveButton.css';

const LeaveButton = ({ setisLeaved }) => {
  return (
    <div className="leaveButtonContainer">
      <div
        className="leaveButton"
        onClick={() => {
          setisLeaved(true);
        }}
      >
        탈퇴하기
      </div>
    </div>
  );
};

export default LeaveButton;
