import React from 'react';
import './HairMakeup.css';

import {
  IoMdArrowRoundForward,
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from 'react-icons/io';

const HairMakeup = ({ shops, isHairOpen, setIsHairOpen }) => {
  const renderedArrow = () => {
    return isHairOpen ? (
      <IoMdArrowDropup fontSize="17px" />
    ) : (
      <IoMdArrowDropdown fontSize="17px" />
    );
  };

  const openInNewTab = url => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  const getShopTypeString = type => {
    switch (type) {
      case 'VISIT':
        return '(출장 헤어/메이크업)';
      case 'SPONSORED':
        return '(제휴)';
      case 'OWNED':
        return '(자체 헤어/메이크업)';
      default:
        return null;
    }
  };

  const renderedHairshopTitle = shop => {
    return (
      <>
        <span className="hairshopName">
          <b>{shop.name}</b>
        </span>
        <span className="goOut"> {getShopTypeString(shop.type)}</span>
        {shop.contactInfo &&
          (shop.contactInfo.startsWith('http') ? (
            <div
              className="hairshopLink"
              onClick={() => openInNewTab(shop.contactInfo)}
            >
              <div className="hairshopContact">헤어샵 정보 보기</div>
              <IoMdArrowRoundForward className="harishopArrow" size="13px" />
            </div>
          ) : (
            <div className="hairshopContact">{shop.contactInfo}</div>
          ))}
      </>
    );
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
                    {item.price === null
                      ? '문의'
                      : `${item.price.toLocaleString()} 원`}
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
