import React from 'react';
import './PhotoItem.css';
import { GetIndoorItem } from '../../functions/WithDb/StudioInfo';

const PhotoItem = ({ currentStudio }) => {
  const indoorItems = GetIndoorItem(currentStudio.studioName);
  console.log(currentStudio.weekDays);

  const renederedIndoorItem = indoorItems.map((item) => {
    return (
      <div className="photoItemContainer">
        <div className="photoItemTopPart">
          <div className="photoItemleftPart">
            <div className="photoItemTitle">{item.title}</div>
            <div className="itemInfo">
              <div className="itemUpper">
                {item.peopleCount}인촬영 - {item.conceptCount}컨셉
              </div>
              <div className="itemUnder">
                원본+최종본 {item.cutCount}컷 | {item.hour}시간
              </div>
            </div>
          </div>
          <div className="photoItemrightPart">
            <div className="photoItemPrice">{item.weekDayPrice}</div>
            <div className="photoItemPrice">{item.weekEndPrice}</div>
          </div>
        </div>
        {item.adding ? (
          <div className="photoItemBottomPart">* {item.adding}</div>
        ) : null}
      </div>
    );
  });
  return (
    <div className="categoryContainer">
      <div className="categoryTitle">촬영 상품</div>
      <div className="placeText">
        <div>스튜디오 상품</div>
        <div className="whichDay">
          <div>{currentStudio.weekDays}</div>
          <div>{currentStudio.weekEnds}</div>
        </div>
      </div>
      <div>{renederedIndoorItem}</div>
    </div>
  );
};

export default PhotoItem;
