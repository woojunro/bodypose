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

  const splitMinMaxPeopleCount = stringToSplit => {
    var arrayOfMinMax = stringToSplit.split('126');
    return `${arrayOfMinMax[0]}~${arrayOfMinMax[1]}`;
  };

  const renderedItem = itemList =>
    itemList.map(item => {
      const peopleCountStr = String(item.peopleCount);
      const conceptCountStr = String(item.conceptCount);
      var minmaxPeopleCount = 0;
      var minmaxConceptCount = 0;
      var conceptNum;
      if (item.conceptCount === 10000) {
        conceptNum = '무제한';
      } else {
        conceptNum = item.conceptCount;
      }
      if (peopleCountStr.includes(126)) {
        minmaxPeopleCount = splitMinMaxPeopleCount(peopleCountStr);
      }
      if (conceptCountStr.includes(126)) {
        minmaxConceptCount = splitMinMaxPeopleCount(conceptCountStr);
      }
      return (
        <div key={`studioProduct-${item.id}`} className="photoItemContainer">
          <div className="photoItemInfoContainer">
            <div className="photoItemTopPart">
              <div className="photoItemleftPart">
                <div className="photoItemTitle">{item.title}</div>
                <div className="photoSpecific">
                  <div className="itemUpper">
                    {item.conceptCount === 0
                      ? peopleCountStr.includes(126)
                        ? `${minmaxPeopleCount}인촬영`
                        : `${item.peopleCount}인촬영 `
                      : peopleCountStr.includes(126)
                      ? conceptCountStr.includes(126)
                        ? `${minmaxPeopleCount}인촬영 - ${minmaxConceptCount}컨셉`
                        : `${minmaxPeopleCount}인촬영 - ${conceptNum}컨셉`
                      : conceptCountStr.includes(126)
                      ? `${item.peopleCount}인촬영 - ${minmaxConceptCount}컨셉`
                      : `${item.peopleCount}인촬영 - ${conceptNum}컨셉`}
                  </div>
                  {currentStudio.isOriginalPhotoProvided ? (
                    <div className="itemUnder">
                      <span>
                        {item.cutCount === 0
                          ? `보정본+원본`
                          : `보정본 ${item.cutCount}컷+원본`}
                      </span>
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
                      {item.cutCount === 0 ? null : `보정본 ${item.cutCount}컷`}
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
                {item.description ? (
                  <div className="photoItemBottomPart">{item.description}</div>
                ) : null}
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
