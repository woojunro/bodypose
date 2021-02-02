import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './ToStudioButton.css';

const ToStudioButton = ({ linkTo }) => {
  const history = useHistory();
  return (
    <Link
      to={{
        pathname: linkTo,
        state: { previousPath: history.location.pathname },
      }}
      onClick={() => {
        window.scrollTo({ top: 0, left: 0 });
      }}
    >
      <div className="toStudioButton">스튜디오 정보 보기</div>
    </Link>
  );
};
export default ToStudioButton;
