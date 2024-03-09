import React from 'react';
import './FullNotice.css';

const FullNotice = ({ text = '' }) => {
  return (
    <div className="fullSizeBox">
      <div className="fullNoticeContainer">{text}</div>
    </div>
  );
};

export default FullNotice;
