import React from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import './PhotoItem.css';
import {
  GetIndoorItem,
  GetOutdoorItem,
} from '../../functions/WithDb/StudioInfo';

const PhotoItem = ({ currentStudio, isPhotoItemOpen, setIsPhotoItemOpen }) => {
  const indoor = GetIndoorItem(currentStudio.studioName);
  const outdoor = GetOutdoorItem(currentStudio.studioName);
  const indoorItems = indoor.prices;
  const outdoorItems = outdoor.prices;
  const indoorNotice = indoor.indoorNotice;
  const outdoorNotice = outdoor.outdoorNotice;

  const renderedArrow = () => {
    return isPhotoItemOpen ? (
      <IoMdArrowDropup fontSize="15px" />
    ) : (
      <IoMdArrowDropdown fontSize="15px" />
    );
  };

  const renederedIndoorItem = indoorItems.map((item) => {
    return (
      <div key={item.title} className="photoItemContainer">
        <div className="photoItemTitle">{item.title}</div>
        <div className="photoItemInfoContainer">
          <div className="photoItemTopPart">
            <div className="photoItemleftPart">
              <div className="itemUpper">
                {item.peopleCount}인촬영 - {item.conceptCount}컨셉
              </div>
              <div className="itemUnder">
                원본+최종본 {item.cutCount}컷 |{` `}
                {item.hour ? <span> {item.hour}시간</span> : null}
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
      </div>
    );
  });

  const renderedIndoorNotice = indoorNotice.map((notice) => {
    return (
      <div key={notice} className="itemNotice">
        *{notice}
      </div>
    );
  });

  const renderedOutdoorItem = outdoorItems.map((item) => {
    return (
      <div key={item.title} className="photoItemContainer">
        <div className="photoItemTitle">{item.title}</div>
        <div className="photoItemInfoContainer">
          <div className="photoItemTopPart">
            <div className="photoItemleftPart">
              <div className="itemUpper">
                {item.peopleCount}인촬영 - {item.conceptCount}컨셉
              </div>
              <div className="itemUnder">
                원본+최종본 {item.cutCount}컷 |{` `}
                {item.hour ? <span> {item.hour}시간</span> : null}
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
      </div>
    );
  });

  const renderedOutdoorNotice = outdoorNotice.map((notice) => {
    return (
      <div key={notice} className="itemNotice">
        *{notice}
      </div>
    );
  });

  return (
    <div className="categoryContainer">
      <div
        onClick={() => setIsPhotoItemOpen(!isPhotoItemOpen)}
        className="categoryTitle"
      >
        촬영 상품 {renderedArrow()}
      </div>
      {isPhotoItemOpen ? (
        <>
          <div className="placeText">
            <div>스튜디오 상품</div>
            <div className="dayContainer">
              <div className="whichDay">
                <div>{currentStudio.weekDays}</div>
                <div>{currentStudio.weekEnds}</div>
              </div>
            </div>
          </div>

          <div>{renederedIndoorItem}</div>
          <div>{renderedIndoorNotice}</div>

          {outdoorItems ? (
            <>
              <div className="placeText">
                <div>아웃도어 상품</div>
                <div className="whichDay">
                  <div>{currentStudio.weekDays}</div>
                  <div>{currentStudio.weekEnds}</div>
                </div>
              </div>
              <div>{renderedOutdoorItem}</div>
              <div>{renderedOutdoorNotice}</div>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default PhotoItem;
