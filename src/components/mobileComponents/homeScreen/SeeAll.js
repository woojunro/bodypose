import React from 'react';
import { Link } from 'react-router-dom';

import './SeeAll.css';
import SeeAllConcept from '../../../materials/icons/SeeAllConcept.png';
import SeeAllReview from '../../../materials/icons/SeeAllReview.png';
import SeeAllStudio from '../../../materials/icons/SeeAllStudio.png';

const SeeAll = () => {
  const items = [
    { name: '스튜디오', icon: SeeAllStudio, pageTo: '/studios' },
    { name: '컨셉', icon: SeeAllConcept, pageTo: '/concepts' },
    { name: '리뷰', icon: SeeAllReview, pageTo: '/reviews' },
  ];

  const renderedItems = items.map(item => {
    return (
      <li key={item.name}>
        <Link
          to={item.pageTo}
          style={{ textDecoration: 'none' }}
          onClick={() => window.scrollTo(0, 0)}
        >
          <div className="itemBox">
            <img alt={item.name} src={item.icon} />
          </div>
          <div className="itemName">{item.name}</div>
        </Link>
      </li>
    );
  });

  return (
    <div className="seeAll">
      <div className="seeAllTitle">모아보기</div>
      <ul>{renderedItems}</ul>
    </div>
  );
};

export default SeeAll;
