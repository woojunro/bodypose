import React from 'react';
import './LeaveButton.css';

const LeaveButton = ({ onClick }) => {
  return (
    <div className="leaveButtonContainer">
      <div className="leaveButton" onClick={onClick}>
        탈퇴하기
      </div>
    </div>
  );
};

export default LeaveButton;
