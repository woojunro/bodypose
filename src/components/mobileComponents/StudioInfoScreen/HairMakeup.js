import React from 'react';
import './HairMakeup.css';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

const HairMakeup = ({ shops, isHairOpen, setIsHairOpen }) => {
  const renderedArrow = () => {
    return isHairOpen ? (
      <IoMdArrowDropup fontSize="17px" />
    ) : (
      <IoMdArrowDropdown fontSize="17px" />
    );
  };

  const renderedHairshopTitle = shop => {
    if (shop.type === 'VISIT') {
      return (
        <>
          <span className="hairshopName">
            <b>{shop.name}</b>
          </span>
          <span className="goOut"> (출장 헤어/메이크업)</span>
          <div className="hairshopContact">{shop.contactInfo}</div>
        </>
      );
    } else if (shop.type === 'SPONSORED') {
      return (
        <>
          <div className="hairshopName">
            <b>{shop.name}</b>
          </div>
          <div className="hairshopAdress">{shop.address}</div>
          <div className="hairshopContact">{shop.contactInfo}</div>
        </>
      );
    } else {
      // OWNED
      return (
        <>
          <div className="hairshopName">
            <b>{shop.name}</b>
          </div>
          <span className="goOut"> (자체 헤어/메이크업)</span>
        </>
      );
    }
  };

  return (
    <div className="categoryContainer">
      <div onClick={() => setIsHairOpen(!isHairOpen)} className="categoryTitle">
        헤어/메이크업{renderedArrow()}
      </div>
      {isHairOpen && (
        <>
          <div className="hairNoContain">
            촬영 상품 가격에는 헤어/메이크업 가격이 포함되지 않았습니다.
          </div>
          {shops.map(shop => (
            <div
              key={`hairMakeupShop-${shop.id}`}
              className="hairMakeupContainer"
            >
              <div className="hairTitleContainer">
                {renderedHairshopTitle(shop)}
              </div>
              {shop.products.map((item, idx) => (
                <div
                  key={`hairMakeupProducts-${item.id}`}
                  className={`hairItemContainer ${
                    idx === shop.products.length - 1 && 'hairItemLastContainer'
                  }`}
                >
                  <div className="hairTitle">{item.title}</div>
                  <div className="hairPrice">
                    {item.price ? `${item.price.toLocaleString()}원` : '문의'}
                  </div>
                </div>
              ))}
              <div className="hairAdding">{shop.productListDescription}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default HairMakeup;
