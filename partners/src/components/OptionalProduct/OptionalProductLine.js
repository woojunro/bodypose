import React, { useState } from 'react';
import './OptionalProductLine.css';
import { GoTriangleUp } from 'react-icons/go';
import { GoTriangleDown } from 'react-icons/go';
import OptionalProductForm from './OptionalProductForm';

const ProductLine = ({
  product,
  setProduct,
  deleteProduct,
  swapWithPrev,
  swapWithNext,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const { title, price, description } = product;

  return isEditing ? (
    <OptionalProductForm
      product={product}
      onSubmit={setProduct}
      onCancel={() => setIsEditing(false)}
    />
  ) : (
    <div className="optionTotalContainer">
      <div className="optionContainer">
        <div className="optionCardTop">
          <div className="optionTitle">{title}</div>
          <div className="optionPrice">
            {price === null ? '문의' : price.toLocaleString()}
          </div>
        </div>
        <div className="optionAdding">{description}</div>
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
