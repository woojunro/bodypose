import React from 'react';
import './OptionalProductList.css';
import OptionalProductLine from './OptionalProductLine';
import OptionalProductForm from './OptionalProductForm';
import { HelpIcon } from '../help/help-icon';
import optionalDesc from '../../materials/imgDescription/optionalDesc.png';

const OptionalProductList = ({
  products = [],
  setProducts = products => {},
}) => {
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
          <div className="productListTitle">추가 상품 목록</div>
        </div>
        <div className="productContainer">
          <div className="productTitleTag">
            <div className="productsTitle">추가 상품</div>
          </div>
        </div>
        <div className="productLists">
          {products.map((product, idx) => (
            <OptionalProductLine
              key={`${idx}-${product.title}`}
              product={product}
              setProduct={product => setProduct(idx, product)}
              deleteProduct={() => deleteProduct(idx)}
              swapWithPrev={() => swapWithPrev(idx)}
              swapWithNext={() => swapWithNext(idx, products.length)}
            />
          ))}
        </div>
      </div>
      <div className="fullSizeBox">
        <div className="productListTitleLine">
          <div className="productListTitle">
            <div className="title-with-tootip">
              <div>추가 상품 추가</div>
              <HelpIcon img={optionalDesc} />
            </div>
          </div>
          <div className="productListDescription">* 필수 입력</div>
        </div>
        <OptionalProductForm onSubmit={addProduct} />
      </div>
    </>
  );
};

export default OptionalProductList;
