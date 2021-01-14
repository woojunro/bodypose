import React from 'react';
import './TopNavigator.css';

const TopNavigator = ({ navigator, setNavigator, reviews = 0 }) => {
  const items = [
    { name: 'portfolio', title: '포트폴리오' },
    { name: 'item', title: '상품' },
    { name: 'info', title: '정보' },
    { name: 'review', title: '리뷰' },
  ];

  const renderedItems = items.map((item) => {
    if (navigator === item.name) {
      if (item.name === 'review') {
        return (
          <div className="selectedItem">
            <span>{item.title}</span>
            <span className="reviewCount">{reviews}</span>
          </div>
        );
      } else {
        return <div className="selectedItem">{item.title}</div>;
      }
    } else {
      if (item.name === 'review') {
        return (
          <div
            onClick={() => setNavigator(item.name)}
            className="unselectedItem"
          >
            <span>{item.title}</span>
            <span className="reviewCount">{reviews}</span>
          </div>
        );
      } else {
        return (
          <div
            onClick={() => setNavigator(item.name)}
            className="unselectedItem"
          >
            {item.title}
          </div>
        );
      }
    }
  });

  return <div className="topNavigator">{renderedItems}</div>;
};
export default TopNavigator;
