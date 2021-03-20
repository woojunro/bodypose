import React from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import './PhotoItem.css';

const PhotoItem = ({
  currentStudio,
  products,
  isPhotoItemOpen,
  setIsPhotoItemOpen,
}) => {
  const indoor = products.filter((product) => product.type === 'STUDIO');
  const outdoor = products.filter((product) => product.type === 'OUTDOOR');
  const indoorNotice = currentStudio.studioProductListDescription;
  const outdoorNotice = currentStudio.outdoorProductListDescription;
  const renderedArrow = () => {
    return isPhotoItemOpen ? (
      <IoMdArrowDropup fontSize="17px" />
    ) : (
      <IoMdArrowDropdown fontSize="17px" />
    );
  };

  const splitMinMaxPeopleCount = (stringToSplit) => {
    var arrayOfMinMax = stringToSplit.split('90');
    return `${arrayOfMinMax[0]}~${arrayOfMinMax[1]}`;
  };

  const renderedItem = (itemList) =>
    itemList.map((item) => {
      const peopleCountStr = String(item.peopleCount);
      var minmaxPeopleCount = 0;
      if (peopleCountStr.includes(90)) {
        minmaxPeopleCount = splitMinMaxPeopleCount(peopleCountStr);
      }
      return (
        <div key={`studioProduct-${item.id}`} className="photoItemContainer">
          <div className="photoItemTitle">{item.title}</div>
          <div className="photoItemInfoContainer">
            <div className="photoItemTopPart">
              <div className="photoItemleftPart">
                <div className="itemUpper">
                  {item.conceptCount === 0
                    ? item.peopleCount > 1000
                      ? `$${minmaxPeopleCount}인촬영`
                      : `${item.peopleCount}인촬영 `
                    : item.peopleCount > 1000
                    ? `${minmaxPeopleCount}인촬영 - ${item.conceptCount}컨셉`
                    : `${item.peopleCount}인촬영 - ${item.conceptCount}컨셉`}
                </div>
                {currentStudio.isOriginalPhotoProvided ? (
                  <div className="itemUnder">
                    보정본 {item.cutCount}컷+원본
                    {item.minuteCount && (
                      <span>
                        {item.minuteCount % 60 === 0
                          ? ` | ${item.minuteCount / 60}시간 내외`
                          : item.minuteCount < 60
                          ? ` | ${item.minuteCount}분 내외`
                          : ` | ${Math.floor(item.minuteCount / 60)}시간 ${
                              item.minuteCount % 60
                            }분 내외`}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="itemUnder">
                    보정본 {item.cutCount}컷
                    {item.minuteCount && (
                      <span>
                        {item.minuteCount % 60 === 0
                          ? ` | ${item.minuteCount / 60}시간 내외`
                          : item.minuteCount < 60
                          ? ` | ${item.minuteCount}분 내외`
                          : ` | ${Math.floor(item.minuteCount / 60)}시간 ${
                              item.minuteCount % 60
                            }분 내외`}
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
    indoorNotice.split('\n').map((notice) => {
      return (
        <div key={notice} className="itemNotice">
          * {notice}
        </div>
      );
    });

  const renderedOutdoorNotice =
    outdoorNotice &&
    outdoorNotice.split('\n').map((notice) => {
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
          {indoor.length !== 0 && (
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
            </>
          )}
          {outdoor.length !== 0 && (
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
          )}
        </>
      ) : null}
    </div>
  );
};

export default PhotoItem;
