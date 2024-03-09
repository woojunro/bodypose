import React from 'react';
import './JoinButton.css';

const JoinButton = ({ usealbe, onClickSubmit }) => {
  return usealbe ? (
    <div className="ableJoinButton" onClick={() => onClickSubmit()}>
      신청하기
    </div>
  ) : (
    <div className="unableJoinButton">신청하기</div>
  );
};

export default JoinButton;
