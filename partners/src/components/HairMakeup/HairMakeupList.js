import React from 'react';
import './HairMakeupList.css';
import HairMakeupShopForm from './HairMakeupShopForm';
import Shop from './Shop';

const HairMakeupList = ({ shops = [], setShops = shops => {} }) => {
  const setShop = (idx, shop) => {
    const productsToUpdate = [...shops];
    productsToUpdate[idx] = shop;
    setShops(productsToUpdate);
  };

  const addShop = shop => setShops([...shops, shop]);

  const deleteShop = idx => setShops(shops.filter((_, _idx) => _idx !== idx));

  return (
    <>
      <div className="fullSizeBox">
        <div className="boxTitle">헤어/메이크업 목록</div>
        <div className="hairMakeupListContainer">
          <div className="hairNoContain">
            촬영 상품 가격에는 헤어/메이크업 가격이 포함되지 않았습니다.
          </div>
          {shops.map((shop, idx) => (
            <Shop
              key={idx}
              shop={shop}
              idx={idx}
              deleteShop={deleteShop}
              setShop={setShop}
            />
          ))}
        </div>
      </div>
      <HairMakeupShopForm onSubmit={addShop} />
    </>
  );
};

export default HairMakeupList;
