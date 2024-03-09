import React, { useState } from 'react';
import './ProductLine.css';
import { GoTriangleUp } from 'react-icons/go';
import { GoTriangleDown } from 'react-icons/go';
import ShootingProductForm from './ShootingProductForm';
import {
  ConceptCountTypes,
  getConceptCountType,
} from '../function/products/conceptType';
import { splitMinutesToHoursMinutes } from '../function/products/time';
import { getPriceType, PriceTypes } from '../function/products/priceType';

const ProductLine = ({
  product,
  setProduct = () => {},
  deleteProduct = () => {},
  swapWithPrev = () => {},
  swapWithNext = () => {},
  weekdayPriceTag = '주중',
  weekendPriceTag = '주말',
}) => {
  const {
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

  const [isEditing, setIsEditing] = useState(false);

  const renderPeopleCount = (peopleCount, maxPeopleCount) =>
    peopleCount === maxPeopleCount
      ? `${peopleCount}인 촬영`
      : `${peopleCount}~${maxPeopleCount || ''}인 촬영`;

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
    const { hours, minutes } = splitMinutesToHoursMinutes(minuteCount);
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

  return isEditing ? (
    <ShootingProductForm
      product={product}
      onSubmit={setProduct}
      onCancel={() => setIsEditing(false)}
      weekdayPriceTag={weekdayPriceTag}
      weekendPriceTag={weekendPriceTag}
    />
  ) : (
    <div className="photoItemTotal">
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
                {renderCutAndMinute(cutCount, isOriginalProvided, minuteCount)}
              </div>
            </div>
            {description && (
              <div className="photoItemBottomPart">{description}</div>
            )}
          </div>
          <div className="photoItemRightPart">
            <div className="photoItemPrice">{renderPrice(weekdayPrice)}</div>
            <div className="photoItemPrice">{renderPrice(weekendPrice)}</div>
          </div>
        </div>
      </div>
      <div className="itemOption" onClick={() => setIsEditing(true)}>
        수정하기
      </div>
      <div className="itemOption" onClick={deleteProduct}>
        삭제하기
      </div>
      <div className="itemOrderDescription">순서변경하기</div>
      <div className="orderIconContainer">
        <GoTriangleUp className="orderIcon" onClick={swapWithPrev} />
        <GoTriangleDown className="orderIcon" onClick={swapWithNext} />
      </div>
    </div>
  );
};

export default ProductLine;
