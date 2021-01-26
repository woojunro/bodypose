import React from 'react';
import './HairMakeup.css';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { GetHairMakeup } from '../../functions/WithDb/StudioInfo';

const HairMakeup = ({ currentStudio, isHairOpen, setIsHairOpen }) => {
  const hairMakeup = GetHairMakeup(currentStudio.studioName);
  const renderedArrow = () => {
    return isHairOpen ? (
      <IoMdArrowDropup fontSize="17px" />
    ) : (
      <IoMdArrowDropdown fontSize="17px" />
    );
  };
  const renderedHairshopTitle = (i) => {
    if (hairMakeup[i].hairWhere === 'inner') {
      return (
        <>
          <span className="hairshopName">제휴샵: {hairMakeup[i].shopName}</span>
          <span className="goOut"> (출장 헤어/메이크업)</span>
          <div className="hairshopContact">{hairMakeup[i].shopContact}</div>
        </>
      );
    } else if (hairMakeup[i].hairWhere === 'outer') {
      return (
        <>
          <div className="hairshopName">제휴샵: {hairMakeup[i].shopName}</div>
          <div className="hairshopAdress">주소: {hairMakeup[i].shopAdress}</div>
          <div className="hairshopContact">{hairMakeup[i].shopContact}</div>
        </>
      );
    } else {
      return null;
    }
  };

  const renderedHairItem = (i) =>
    hairMakeup[i].items.map((item) => {
      return (
        <div key={item.title} className="hairItemContainer">
          <div className="hairTitle">{item.title}</div>
          {item.discountPrice ? (
            <>
              <div className="hairPrice">
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
  const renderedAdding = (i) =>
    hairMakeup[i].adding.map((add) => {
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
            {renderedHairshopTitle(0)}
            <div className="itemContainer">{renderedHairItem(0)}</div>
          </div>
          {renderedAdding(0)}
          <div className="hairMakeupContainer">
            {renderedHairshopTitle(1)}
            <div className="itemContainer">{renderedHairItem(1)}</div>
          </div>
          {renderedAdding(1)}
        </>
      ) : null}
    </div>
  );
};

export default HairMakeup;
