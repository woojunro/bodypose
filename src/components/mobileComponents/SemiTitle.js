import React from 'react';
import './SemiTitle.css';

const SemiTitle = ({ title }) => {
  return (
    <div className="titleContainer">
      <span className="title">{title}</span>
      <span className="showMore"> 더보기</span>
    </div>
  );
};

export default SemiTitle;
