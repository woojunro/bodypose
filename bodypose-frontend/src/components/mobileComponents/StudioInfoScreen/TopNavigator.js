import React from 'react';
import './TopNavigator.css';

const TopNavigator = ({ navigator, setNavigator, reviews = 0 }) => {
  const items = [
    { name: 'portfolio', title: '포트폴리오' },
    { name: 'item', title: '상품' },
    { name: 'info', title: '정보' },
    // { name: 'review', title: '리뷰' },
  ];

  const renderedItems = items.map(item => {
    if (navigator === item.name) {
      return (
        <div key={item.title} className="selectedItem">
          <div className="selectedTitle">{item.title}</div>
        </div>
      );
    } else {
      return (
        <div
          key={item.title}
          onClick={() => setNavigator(item.name)}
          className="unselectedItem"
        >
          {item.title}
        </div>
      );
    }
  });

  return <div className="topNavigator">{renderedItems}</div>;
};
export default TopNavigator;
