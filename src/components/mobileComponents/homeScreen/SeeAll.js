import React from 'react';
import { useHistory } from 'react-router-dom';

import './SeeAll.css';
import SeeAllConcept from '../../../materials/icons/SeeAllConcept.png';
// import SeeAllReview from '../../../materials/icons/SeeAllReview.png';
import SeeAllStudio from '../../../materials/icons/SeeAllStudio.png';
import { StudioLocationVar } from '../../../apollo';

const SeeAll = () => {
  const history = useHistory();
  const items = [
    {
      name: '스튜디오',
      icon: SeeAllStudio,
      onClick: () => {
        StudioLocationVar(null);
        history.push('/studios');
      },
    },
    {
      name: '컨셉',
      icon: SeeAllConcept,
      onClick: () => history.push('/concepts'),
    },
    // { name: '리뷰', icon: SeeAllReview, pageTo: '/reviews' },
  ];

  const renderedItems = items.map(item => {
    return (
      <li key={item.name}>
        <div className="itemBox" onClick={item.onClick}>
          <img alt={item.name} src={item.icon} />
        </div>
        <div className="itemName">{item.name}</div>
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
