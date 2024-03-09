import React from 'react';
import './column-navigator.css';

const ColumnNavigator = ({ categoryId, setCategoryId, categories = [] }) => {
  const allCategoryName = 'ALL';
  const isAllCategorySelected = categoryId === null;

  const categoryList = [...categories]
    .sort((a, b) => a.order - b.order)
    .filter(c => c.id === 4 || c.id === 1); // 촬영팁만

  return (
    <div className="column-navigator">
      {isAllCategorySelected ? (
        <div className="column-navigator-type-selected">{allCategoryName}</div>
      ) : (
        <div
          className="column-navigator-type-unselected"
          onClick={() => setCategoryId(null)}
        >
          {allCategoryName}
        </div>
      )}
      {categoryList.map(category =>
        categoryId === category.id ? (
          <div key={category.id} className="column-navigator-type-selected">
            {category.name}
          </div>
        ) : (
          <div
            key={category.id}
            className="column-navigator-type-unselected"
            onClick={() => setCategoryId(category.id)}
          >
            {category.name}
          </div>
        )
      )}
    </div>
  );
};

export default ColumnNavigator;
