import './ProductList.css';
import React from 'react';
import ProductLine from './ProductLine';
import ShootingProductForm from './ShootingProductForm';
import { HelpIcon } from '../help/help-icon';
import ProductDescription from '../../materials/imgDescription/description.png';

const ProductList = ({
  outdoor = false,
  products = [],
  setProducts = (products = []) => {},
  weekdayPriceTag = '주중',
  weekendPriceTag = '주말',
}) => {
  const productType = outdoor ? '아웃도어' : '스튜디오';

  const setProduct = (idx, product) => {
    const productsToUpdate = [...products];
    productsToUpdate[idx] = product;
    setProducts(productsToUpdate);
  };

  const addProduct = product => setProducts([...products, product]);

  const deleteProduct = idx =>
    setProducts(products.filter((_, _idx) => _idx !== idx));

  const swapWithPrev = idx => {
    if (idx <= 0) return;
    const productsToUpdate = [...products];
    const temp = { ...productsToUpdate[idx - 1] };
    productsToUpdate[idx - 1] = { ...productsToUpdate[idx] };
    productsToUpdate[idx] = { ...temp };
    setProducts(productsToUpdate);
  };

  const swapWithNext = (idx, length) => {
    if (idx >= length - 1) return;
    const productsToUpdate = [...products];
    const temp = { ...productsToUpdate[idx + 1] };
    productsToUpdate[idx + 1] = { ...productsToUpdate[idx] };
    productsToUpdate[idx] = { ...temp };
    setProducts(productsToUpdate);
  };

  return (
    <>
      <div className="fullSizeBox">
        <div className="productListTitleLine">
          <div className="productListTitle">{productType} 상품 목록</div>
        </div>
        <div className="productContainer">
          <div className="productTitleTag">
            <div className="productsTitle">{productType} 상품</div>
            <div className="weekTags">
              <div>{weekdayPriceTag}</div>
              <div>{weekendPriceTag}</div>
            </div>
          </div>
        </div>
        <div className="productLists">
          {products.map((product, idx) => (
            <ProductLine
              key={`${idx}-${product.title}`}
              product={product}
              setProduct={product => setProduct(idx, product)}
              deleteProduct={() => deleteProduct(idx)}
              swapWithPrev={() => swapWithPrev(idx)}
              swapWithNext={() => swapWithNext(idx, products.length)}
              weekdayPriceTag={weekdayPriceTag}
              weekendPriceTag={weekendPriceTag}
            />
          ))}
        </div>
      </div>
      <div className="fullSizeBox">
        <div className="productListTitleLine">
          <div className="productListTitle">
            <div className="title-with-tootip">
              <div>{productType} 상품 추가</div>
              <HelpIcon img={ProductDescription} />
            </div>
          </div>
          <div className="productListDescription">* 필수 입력</div>
        </div>
        <ShootingProductForm
          onSubmit={addProduct}
          weekdayPriceTag={weekdayPriceTag}
          weekendPriceTag={weekendPriceTag}
        />
      </div>
    </>
  );
};

export default ProductList;
