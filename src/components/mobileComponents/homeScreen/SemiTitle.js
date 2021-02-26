import React from 'react';
import { Link } from 'react-router-dom';
import './SemiTitle.css';

const SemiTitle = ({ title, pageTo }) => {
  return (
    <div className="titleContainer">
      <span className="title">{title}</span>
      <Link
        to={pageTo}
        style={{ textDecoration: 'none' }}
        onClick={() => window.scrollTo(0, 0)}
      >
        <span className="showMore"> 더보기</span>
      </Link>
    </div>
  );
};

export default SemiTitle;
