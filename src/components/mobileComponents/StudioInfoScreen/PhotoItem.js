import React from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import './PhotoItem.css';

const PhotoItem = ({
  currentStudio,
  products,
  isPhotoItemOpen,
  setIsPhotoItemOpen,
}) => {
  const indoor = products.filter(product => product.type === 'STUDIO');
  const outdoor = products.filter(product => product.type === 'OUTDOOR');
  const indoorNotice = currentStudio.studioProductListDescription;
  const outdoorNotice = currentStudio.outdoorProductListDescription;
  const renderedArrow = () => {
    return isPhotoItemOpen ? (
      <IoMdArrowDropup fontSize="17px" />
    ) : (
      <IoMdArrowDropdown fontSize="17px" />
    );
  };

  const renderedItem = itemList =>
    itemList.map(item => {
      return (
        <div key={`studioProduct-${item.id}`} className="photoItemContainer">
          <div className="photoItemTitle">{item.title}</div>
          <div className="photoItemInfoContainer">
            <div className="photoItemTopPart">
              <div className="photoItemleftPart">
                <div className="itemUpper">
                  {item.peopleCount}인촬영 - {item.conceptCount}컨셉
                </div>
                {currentStudio.isOriginalPhotoProvided ? (
                  <div className="itemUnder">
                    원본+최종본 {item.cutCount}컷
                    {item.minuteCount && (
                      <span>
                        {item.minuteCount % 60 === 0
                          ? ` | ${item.minuteCount / 60}시간`
                          : ` | ${Math.floor(item.minuteCount / 60)}시간 ${
                              item.minuteCount % 60
                            }분`}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="itemUnder">
                    최종본 {item.cutCount}컷
                    {item.minuteCount && (
                      <span>
                        {item.minuteCount % 60 === 0
                          ? ` | ${item.minuteCount / 60}시간`
                          : ` | ${Math.floor(item.minuteCount / 60)}시간 ${
                              item.minuteCount % 60
                            }분`}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="photoItemrightPart">
                <div className="photoItemPrice">
                  {item.weekdayPrice.toLocaleString()}
                </div>
                <div className="photoItemPrice">
                  {item.weekendPrice.toLocaleString()}
                </div>
              </div>
            </div>
            {item.description ? (
              <div className="photoItemBottomPart">* {item.description}</div>
            ) : null}
          </div>
        </div>
      );
    });

  const renderedIndoorNotice =
    indoorNotice &&
    indoorNotice.split('\n').map(notice => {
      return (
        <div key={notice} className="itemNotice">
          * {notice}
        </div>
      );
    });

  const renderedOutdoorNotice =
    outdoorNotice &&
    outdoorNotice.split('\n').map(notice => {
      return (
        <div key={notice} className="itemNotice">
          * {notice}
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
                <div>{currentStudio.weekdayPriceTag}</div>
                <div>{currentStudio.weekendPriceTag}</div>
              </div>
            </div>
          </div>

          <div>{renderedItem(indoor)}</div>
          <div>{renderedIndoorNotice}</div>

          {outdoor.length !== 0 ? (
            <>
              <div className="placeText">
                <div>아웃도어 상품</div>
                <div className="whichDay">
                  <div>{currentStudio.weekdayPriceTag}</div>
                  <div>{currentStudio.weekendPriceTag}</div>
                </div>
              </div>
              <div>{renderedItem(outdoor)}</div>
              <div>{renderedOutdoorNotice}</div>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default PhotoItem;
