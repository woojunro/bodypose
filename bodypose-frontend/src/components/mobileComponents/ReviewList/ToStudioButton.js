import React from 'react';
import { useHistory } from 'react-router-dom';
import './ToStudioButton.css';

const ToStudioButton = ({ linkTo }) => {
  const history = useHistory();
  return (
    <div
      className="toStudioButton"
      onClick={() => {
        history.push({
          pathname: linkTo,
          state: { previousPath: history.location.pathname },
        });
        window.scrollTo({ top: 0, left: 0 });
      }}
    >
      스튜디오 정보 보기
    </div>
  );
};
export default ToStudioButton;
