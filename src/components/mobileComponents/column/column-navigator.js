import React from 'react';
import './column-navigator.css';

const ColumnCategory = [
  { category: 'all', title: '전체' },
  { category: 'before-body-profile', title: '비포 바프' },
  { category: 'after-body-profile', title: '애프터 바프' },
  { category: 'diet', title: '다이어트' },
  { category: 'photo', title: '바프 촬영팁' },
];

const ColumnNavigator = ({ columnCategory, setColumnCategory }) => {
  //카테고리 불러오기.
  const categories = ColumnCategory;

  const RenderedCategories = categories.map(category => {
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
