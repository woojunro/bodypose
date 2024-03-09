import React from 'react';
import './StudioStatsCard.css';
import { IoCaretUp } from 'react-icons/io5';
import { IoCaretDown } from 'react-icons/io5';

const StudioStatsCard = ({
  title,
  description,
  lastData,
  currentData,
  isEmpty,
  isClickable,
  onClick,
}) => {
  if (isEmpty) {
    return <div className="emptyStudioStatsCard"></div>;
  } else {
    //변화된 수치.
    let change;
    let renderedArrow;
    if (lastData !== null) {
      change = Number(currentData) - Number(lastData);
      renderedArrow = () => {
        if (change === 0) {
          return null;
        } else if (change > 0) {
          return <IoCaretUp className="arrowUp" />;
        } else {
          return <IoCaretDown className="arrowDown" />;
        }
      };
    }
    return isClickable ? (
      <div onClick={onClick} className="clickableStudioStatsCard">
        <div className="studioCardTitle">{title}</div>
        <div className="studioCardDescription">{description}</div>
        <div className="studioCardNumberContainer">
          <div className="currentDataNumber">{currentData}</div>
          {lastData === null ? null : (
            <div className="statsChangeContainer">
              <div className="statsChange">
                {change == null
                  ? null
                  : change > 0
                  ? String(change)
                  : String(change * -1)}
              </div>
              {renderedArrow()}
            </div>
          )}
        </div>
      </div>
    ) : (
      <div className="studioStatsCard">
        <div className="studioCardTitle">{title}</div>
        <div className="studioCardDescription">{description}</div>
        <div className="studioCardNumberContainer">
          <div className="currentDataNumber">{currentData}</div>
          {lastData === null ? null : (
            <div className="statsChangeContainer">
              <div className="statsChange">
                {change > 0 ? String(change) : String(change * -1)}
              </div>
              {renderedArrow()}
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default StudioStatsCard;
