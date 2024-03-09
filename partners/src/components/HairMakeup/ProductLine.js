import React, { useState, useEffect } from 'react';
import { EMPTY_PRODUCT_TITLE } from '../../constants/errorMessages';
import './ProductLine.css';

const ProductLine = ({
  product,
  setProduct = product => {},
  deleteProduct = () => {},
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setTitle(product.title);
    setPrice(product.price);
    if (!product.title) setIsEdit(true);
  }, [product, isEdit]);

  const SaveData = () => {
    if (title) {
      setProduct({
        title,
        price: price === 0 ? Number(price) : price ? Number(price) : null,
      });
      setIsEdit(false);
    } else {
      alert(EMPTY_PRODUCT_TITLE);
    }
  };

  return isEdit ? (
    <div className="shopProductLine">
      <input
        key="shopTitle"
        className="shopProductTitle"
        value={title}
        placeholder="상품명 (최대 50자)"
        maxLength={50}
        onChange={e => setTitle(e.target.value)}
      />
      <div className="shopProductLineText">가격</div>
      <input
        key="shopPrice"
        type="number"
        className="shopProductPrice"
        value={price}
        placeholder="미입력시 '문의'라는 문구로 대체됩니다."
        min={0}
        onChange={e => setPrice(e.target.value)}
      />
      <div className="deleteShopProduct" onClick={SaveData}>
        완료
      </div>
      <div
        className="deleteShopProduct"
        onClick={() => {
          if (title) setIsEdit(false);
          else deleteProduct();
        }}
      >
        취소
      </div>
    </div>
  ) : (
    <div className="shopProductLine">
      <div className="shopProductTitleText">{title}</div>
      <div className="shopProductLineText">가격</div>
      <div className="shopProductPriceText">
        {price !== null ? `${price.toLocaleString()} 원` : '문의'}
      </div>
      <div className="deleteShopProduct" onClick={() => setIsEdit(true)}>
        수정
      </div>
      <div className="deleteShopProduct" onClick={deleteProduct}>
        삭제
      </div>
    </div>
  );
};

export default ProductLine;
