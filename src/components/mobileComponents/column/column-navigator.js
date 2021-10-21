import React from 'react';
import './column-navigator.css';

const ColumnCategory = [
  { category: 'all', title: '전체' },
  { category: 'training', title: '트레이닝' },
  { category: 'nutrition', title: '식단' },
  { category: 'photo', title: '촬영팁' },
];

const ColumnNavigator = ({ columnCategory, setColumnCategory }) => {
  const RenderedCategories = ColumnCategory.map(category => {
    if (category.category === columnCategory) {
      return (
        <div key={category.category} className="column-navigator-type-selected">
          {category.title}
        </div>
      );
    }
    return (
      <div
        key={category.category}
        className="column-navigator-type-unselected"
        onClick={() => setColumnCategory(category.category)}
      >
        {category.title}
      </div>
    );
  });
  return <div className="column-navigator">{RenderedCategories}</div>;
};

export default ColumnNavigator;
