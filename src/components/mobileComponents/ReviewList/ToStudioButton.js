import React from 'react';
import { Link } from 'react-router-dom';
import './ToStudioButton.css';

const ToStudioButton = ({ linkTo }) => {
  return (
    <Link to={linkTo}>
      <div className="toStudioButton">스튜디오 정보 보기</div>
    </Link>
  );
};
export default ToStudioButton;
