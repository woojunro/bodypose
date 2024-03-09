import React from 'react';
import './GeneralProduct.css';
import WeekTagImg from '../../materials/imgDescription/weekTag.png';
import WeekTag from './WeekTag';
import { HelpIcon } from '../help/help-icon';

const GeneralProduct = ({
  weekdayTag = '',
  setWeekdayTag,
  weekendTag = '',
  setWeekendTag,
}) => (
  <div className="fullSizeBox">
    <div className="boxTitle">
      <div className="title-with-tootip">
        <div>촬영 상품 정보</div>
        <HelpIcon img={WeekTagImg} />
      </div>
    </div>
    <div className="generalProductContainer">
      <div className="weekTagLine">
        <div className="gereralProductTitle"> 주중 가격 태그</div>
        <div className="gereralProductData">
          <WeekTag
            currentStatus={weekdayTag}
            setCurrentStatus={setWeekdayTag}
          />
        </div>
      </div>
      <div className="weekTagLine">
        <div className="gereralProductTitle"> 주말 가격 태그</div>
        <div className="gereralProductData">
          <WeekTag
            currentStatus={weekendTag}
            setCurrentStatus={setWeekendTag}
          />
        </div>
      </div>
    </div>
  </div>
);

export default GeneralProduct;
