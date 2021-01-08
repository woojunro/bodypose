import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import './EmailJoinScreen.css';

const EmailJoin = () => {
  const history = useHistory();
  return (
    <div>
      <FiArrowLeft
        onClick={() => {
          history.goBack();
        }}
        className="loginBackArrow"
      />
      <div>Email Join</div>
    </div>
  );
};

export default EmailJoin;
