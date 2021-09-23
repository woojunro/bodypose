import React from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import {
  ConceptCountTypes,
  PeopleCountTypes,
  PriceTypes,
} from '../../../constants/studioProductTypes';
import {
  getConceptCountType,
  getPeopleCountType,
  getPriceType,
} from '../../functions/Studio/GetStudioProductType';
import './PhotoItem.css';

const PhotoItem = ({
  currentStudio,
  products,
  isPhotoItemOpen,
  setIsPhotoItemOpen,
}) => {
  const indoor = products.filter(product => product.type === 'STUDIO');
  const outdoor = products.filter(product => product.type === 'OUTDOOR');
  const indoorNotice = currentStudio.info?.studioProduct;
  const outdoorNotice = currentStudio.info?.outdoorProduct;

  const renderedArrow = () => {
    return isPhotoItemOpen ? (
      <IoMdArrowDropup fontSize="17px" />
    ) : (
      <IoMdArrowDropdown fontSize="17px" />
    );
  };

  const renderPeopleCount = (peopleCount, maxPeopleCount) => {
    const type = getPeopleCountType(peopleCount, maxPeopleCount);
    return type === PeopleCountTypes.SINGLE_VALUE
      ? `${peopleCount}인 촬영`
      : `${peopleCount}~${maxPeopleCount || ''}인 촬영`;
  };

  const renderConceptCount = (conceptCount, maxConceptCount) => {
    const type = getConceptCountType(conceptCount, maxConceptCount);
    switch (type) {
      case ConceptCountTypes.INFINITE:
        return '무제한 컨셉';
      case ConceptCountTypes.NO_EXPOSURE:
        return '';
      case ConceptCountTypes.SINGLE_VALUE:
        return `${conceptCount}컨셉`;
      case ConceptCountTypes.MULTI_VALUES:
        return `${conceptCount}~${maxConceptCount || ''}컨셉`;
      default:
        return null;
    }
  };

  const renderCutCount = (cutCount, isOriginalProvided) => {
    const renderStrings = [];
    if (cutCount > 0) renderStrings.push(`보정본 ${cutCount}컷`);
    if (isOriginalProvided) renderStrings.push('원본 제공');
    return renderStrings.join(', ');
  };

  const renderMinuteCount = minuteCount => {
    if (!minuteCount) return null;
    const hours = Math.floor(minuteCount / 60);
    const minutes = minuteCount % 60;
    const renderStrings = [];
    if (hours > 0) renderStrings.push(`${hours}시간`);
    if (minutes > 0) renderStrings.push(`${minutes}분`);
    if (renderStrings.length > 0) renderStrings.push('내외');
    return renderStrings.join(' ');
  };

  const renderCutAndMinute = (cutCount, isOriginalProvided, minuteCount) => {
    const renderStrings = [];
    const cut = renderCutCount(cutCount, isOriginalProvided);
    const minute = renderMinuteCount(minuteCount);
    if (cut) renderStrings.push(cut);
    if (minute) renderStrings.push(minute);
    return renderStrings.join(' | ');
  };

  const renderPrice = price => {
    const type = getPriceType(price);
    switch (type) {
      case PriceTypes.NO_EXPOSURE:
        return 'X';
      case PriceTypes.CONTACT:
        return '문의';
      case PriceTypes.VALUE:
        return price.toLocaleString();
      default:
        return null;
    }
  };

  const renderProducts = products =>
    products.map(product => {
      const {
        id,
        title,
        peopleCount,
        maxPeopleCount,
        conceptCount,
        maxConceptCount,
        cutCount,
        minuteCount,
        description,
        weekdayPrice,
        weekendPrice,
        isOriginalProvided,
      } = product;

      return (
        <div key={`studioProduct-${id}`} className="photoItemContainer">
          <div className="photoItemInfoContainer">
            <div className="photoItemTopPart">
              <div className="photoItemleftPart">
                <div className="photoItemTitle">{title}</div>
                <div className="photoSpecific">
                  <div className="itemUpper">
                    {renderPeopleCount(peopleCount, maxPeopleCount)}
                    {renderConceptCount(conceptCount, maxConceptCount) &&
                      ` - ${renderConceptCount(conceptCount, maxConceptCount)}`}
                  </div>
                  <div className="itemUnder">
                    {renderCutAndMinute(
                      cutCount,
                      isOriginalProvided,
                      minuteCount
                    )}
                  </div>
                </div>
                {description && (
                  <div className="photoItemBottomPart">{description}</div>
                )}
              </div>
              <div className="photoItemrightPart">
                <div className="photoItemPrice">
                  {renderPrice(weekdayPrice)}
                </div>
                <div className="photoItemPrice">
                  {renderPrice(weekendPrice)}
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
      {isPhotoItemOpen && (
        <>
          {indoor.length !== 0 && (
            <>
              <div className="placeText">
                <div>스튜디오 상품</div>
                <div className="dayContainer">
                  <div className="whichDay">
                    <div>{currentStudio.info?.weekdayPriceTag || '평일'}</div>
                    <div>{currentStudio.info?.weekendPriceTag || '주말'}</div>
                  </div>
                </div>
              </div>
              <div>{renderProducts(indoor)}</div>
              <div>{renderedIndoorNotice}</div>
            </>
          )}
          {outdoor.length !== 0 && (
            <>
              <div className="placeText">
                <div>아웃도어 상품</div>
                <div className="whichDay">
                  <div>{currentStudio.info?.weekdayPriceTag || '평일'}</div>
                  <div>{currentStudio.info?.weekendPriceTag || '주말'}</div>
                </div>
              </div>
              <div>{renderProducts(outdoor)}</div>
              <div>{renderedOutdoorNotice}</div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PhotoItem;
