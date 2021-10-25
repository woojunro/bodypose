import React from 'react';
import { useHistory } from 'react-router';
import './column-list-element.css';

const ColumnListElement = ({ columnData }) => {
  const history = useHistory();
  return (
    <div
      className="column-list-element"
      onClick={() => {
        history.push(`/magazine/columns/${columnData.id}`);
        window.scrollTo(0, 0);
      }}
    >
      <img
        src={columnData.thumbnailUrl}
        alt="columnimg"
        className="column-list-element-image"
      />
      <div className="column-list-element-data">
        <div className="column-list-element-data-top">
          <div className="column-list-element-category">
            {columnData.categories.map(c => c.name).join(', ')}
          </div>
        </div>
        <div className="column-list-element-title">{columnData.title}</div>
        <div className="column-list-element-data-bottom">
          <div className="column-list-element-writer-container">
            <img
              className="column-list-element-logo"
              src={columnData.author.logoUrl}
              alt="logo"
            />
            <div className="column-list-element-writer">
              {columnData.author.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnListElement;
