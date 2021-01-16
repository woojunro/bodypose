import React from 'react';
import './HairMakeup.css';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { GetHairMakeup } from '../../functions/WithDb/StudioInfo';
import { ImArrowRight } from 'react-icons/im';

const HairMakeup = ({ currentStudio, isHairOpen, setIsHairOpen }) => {
  const hairMakeup = GetHairMakeup(currentStudio.studioName);
  const renderedArrow = () => {
    return isHairOpen ? (
      <IoMdArrowDropup fontSize="15px" />
    ) : (
      <IoMdArrowDropdown fontSize="15px" />
    );
  };
  const renderedHairshopTitle = () => {
    if (hairMakeup.hairWhere === 'inner') {
      return (
        <>
          <span className="hairshopName">제휴샵: {hairMakeup.shopName}</span>
          <span className="goOut"> (출장 헤어/메이크업)</span>
          <div className="hairshopContact">{hairMakeup.shopContact}</div>
        </>
      );
    } else if (hairMakeup.hairWhere === 'outer') {
      return (
        <>
          <div className="hairshopName">제휴샵: {hairMakeup.shopName}</div>
          <div className="hairshopAdress">주소: {hairMakeup.shopAdress}</div>
          <div className="hairshopContact">{hairMakeup.shopContact}</div>
        </>
      );
    } else {
      return null;
    }
  };

  const renderedHairItem = hairMakeup.items.map((item) => {
    return (
      <div key={item.title} className="hairItemContainer">
        <div className="hairTitle">{item.title}</div>
        {item.discountPrice ? (
          <>
            <div className="hairPrice">
              <div>정상가 {item.originalPrice}원</div>
              <ImArrowRight className="hairArrow" />
              <div>제휴가 {item.discountPrice}원</div>
            </div>
          </>
        ) : (
          <div className="hairPrice"> {item.originalPrice}원</div>
        )}

        <div></div>
      </div>
    );
  });
  const renderedAdding = hairMakeup.adding.map((add) => {
    return (
      <div key={add} className="hairAdding">
        * {add}
      </div>
    );
  });
  return (
    <div className="categoryContainer">
      <div onClick={() => setIsHairOpen(!isHairOpen)} className="categoryTitle">
        헤어/메이크업{renderedArrow()}
      </div>

      {isHairOpen ? (
        <>
          <div className="hairNoContain">
            촬영 상품 가격에는 헤어/메이크업 가격이 포함되지 않았습니다.
          </div>
          <div className="hairMakeupContainer">
            {renderedHairshopTitle()}
            <div className="itemContainer">{renderedHairItem}</div>
          </div>
          {renderedAdding}
        </>
      ) : null}
    </div>
  );
};

export default HairMakeup;
