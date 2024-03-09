import React from 'react';
import { useHistory } from 'react-router-dom';
import './SemiTitle.css';

const SemiTitle = ({ title, pageTo }) => {
  const history = useHistory();
  return (
    <div className="titleContainer">
      <span className="title">{title}</span>

      <span
        className="showMore"
        onClick={() => {
          history.push(pageTo);
          window.scrollTo(0, 0);
        }}
      >
        더보기
      </span>
    </div>
  );
};

export default SemiTitle;
