import React, { useState } from 'react';
import './Shop.css';
import ShopInformation from './ShopInformation';
import HairMakeupShopForm from './HairMakeupShopForm';

const Shop = ({ shop, idx, setShop, deleteShop }) => {
  const [isEditing, setIsEditing] = useState(false);

  const ControllEdit = () => {
    setIsEditing(!isEditing);
  };

  return !isEditing ? (
    <div className="hairMakeupContainer">
      <div>
        <div className="hairTitleContainer">
          <ShopInformation information={shop} />
        </div>
        {shop.products.map((item, idx) => (
          <div
            key={idx}
            className={`hairItemContainer ${
              idx === shop.products.length - 1 && 'hairItemLastContainer'
            }`}
          >
            <div className="hairTitle">{item.title}</div>
            <div className="hairPrice">
              {item.price === null
                ? '문의'
                : `${item.price.toLocaleString()}원`}
            </div>
          </div>
        ))}
        <div className="hairAdding">{shop.productListDescription}</div>
      </div>
      <div className="shopListEditContainer">
        <div className="shopListEdit" onClick={() => ControllEdit()}>
          수정
        </div>
        <div className="shopListEdit" onClick={() => deleteShop(idx)}>
          삭제
        </div>
      </div>
    </div>
  ) : (
    <HairMakeupShopForm
      shop={shop}
      onSubmit={shop => {
        setShop(idx, shop);
        setIsEditing(false);
      }}
    />
  );
};

export default Shop;
