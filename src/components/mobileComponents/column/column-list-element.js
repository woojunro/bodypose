import React from 'react';
import { useHistory } from 'react-router';
import './column-list-element.css';

const RenderColumnCategory = category => {
  if (category === 'training') {
    return '트레이닝';
  } else if (category === 'nutrition') {
    return '식단';
  } else {
    return '촬영팁';
  }
};

const ColumnListElement = ({ columnData }) => {
  const history = useHistory();
  return (
    <div
      className="column-list-element"
      onClick={() => history.push(`/columns/${columnData.id}`)}
    >
      <img
        src={columnData.img}
        alt="columnimg"
        className="column-list-element-image"
      />
      <div className="column-list-element-data">
        <div className="column-list-element-data-top">
          <div className="column-list-element-category">
            {RenderColumnCategory(columnData.category)}
          </div>
        </div>
        <div className="column-list-element-title">{columnData.title}</div>
        <div className="column-list-element-data-bottom">
          <div className="column-list-element-writer-container">
            <img
              className="column-list-element-logo"
              src={columnData.logo}
              alt="logo"
            />
            <div className="column-list-element-writer">
              {columnData.writer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnListElement;
