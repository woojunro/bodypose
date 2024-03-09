import React, { useEffect, useState } from 'react';
import './HairMakeupShopForm.css';
import { useForm } from 'react-hook-form';
import ProductLine from './ProductLine';
import { IoIosAddCircleOutline } from 'react-icons/io';
import {
  EMPTY_PRODUCT_TITLE,
  INVALID_FORM,
} from '../../constants/errorMessages';
import { HelpIcon } from '../help/help-icon';
import HairMakeupDesc from '../../materials/imgDescription/hairMakeupDesc.png';

const ShopTypes = {
  SPONSORED: '제휴',
  VISIT: '출장',
  OWNED: '스튜디오 자체',
};

const HairMakeupShopForm = ({ shop, onSubmit = shop => {} }) => {
  const isUpdating = Boolean(shop);

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      name: '',
      type: Object.keys(ShopTypes)[0],
      contactInfo: '',
      address: '',
      productListDescription: '',
    },
  });

  const emptyProduct = { title: '', price: 0 };

  const [products, setProducts] = useState([emptyProduct]);

  useEffect(() => {
    if (isUpdating) {
      const {
        name,
        type,
        contactInfo,
        address,
        productListDescription,
        products,
      } = shop;

      setValue('name', name);
      setValue('type', type);
      setValue('contactInfo', contactInfo);
      setValue('address', address);
      setValue('productListDescription', productListDescription);
      setProducts([...products]);
    }
  }, [isUpdating, shop, setValue]);

  const setProduct = (idx, product) => {
    const productsToUpdate = [...products];
    productsToUpdate[idx] = product;
    setProducts([...productsToUpdate]);
  };

  const addProduct = () => setProducts([...products, emptyProduct]);

  const deleteProuct = idx =>
    setProducts(products.filter((_, _idx) => _idx !== idx));

  const onFormSubmit = data => {
    for (const product of products) {
      if (!product.title) {
        alert(EMPTY_PRODUCT_TITLE);
        return;
      }
    }

    onSubmit({
      ...data,
      products: products.map(product => {
        const { id, __typename, ...fields } = product;
        return { ...fields };
      }),
    });

    if (!isUpdating) {
      reset({
        name: '',
        type: Object.keys(ShopTypes)[0],
        contactInfo: '',
        address: '',
        productListDescription: '',
      });
      setProducts([emptyProduct]);
    }
  };

  const onError = () => alert(INVALID_FORM);

  return (
    <div className="fullSizeBox">
      <div className="hairshopBoxTitle">
        <div className="title-with-tootip">
          <div> 헤어/메이크업 추가</div>
          <HelpIcon img={HairMakeupDesc} />
        </div>
        <div className="hairshopTitleDesc">* 필수 입력</div>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit, onError)}>
        <div>
          <div className="shopInputContainer">
            <div>
              <input
                className="shopInputName"
                type="text"
                placeholder="업체명 (최대 30자)"
                required
                maxLength={30}
                {...register('name', { required: true, maxLength: 30 })}
              />
            </div>
            <div className="inputDatas">
              <div className="inputData">
                <div className="inputDataTitle">* 서비스 형태</div>
                <select className="shopTypeInput" {...register('type')}>
                  {Object.keys(ShopTypes).map(key => (
                    <option key={key} value={key}>
                      {ShopTypes[key]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="inputData">
                <div className="inputDataTitle">업체 연락처</div>
                <input
                  className="shopInputContactInfo"
                  placeholder="URL 입력 시 해당 주소로 링크 생성됩니다."
                  maxLength={255}
                  {...register('contactInfo', { maxLength: 255 })}
                />
              </div>
              <div className="inputData">
                <div className="inputDataTitle">업체 주소</div>
                <input
                  className="shopInputContactInfo"
                  {...register('address', { maxLength: 100 })}
                />
              </div>
              <div className="shopProductList">상품 목록</div>
              {products.map((product, idx) => (
                <div key={`${product.title}-${idx}`} className="inputData">
                  <ProductLine
                    product={product}
                    setProduct={product => setProduct(idx, product)}
                    deleteProduct={() => deleteProuct(idx)}
                  />
                </div>
              ))}
              <div className="addShopProduct" onClick={addProduct}>
                <IoIosAddCircleOutline className="addShopProductIcon" />
                <div className="addShopProductText">상품 추가하기</div>
              </div>
              <div className="shopProductList">업체 추가 설명</div>
              <div className="inputData">
                <textarea
                  className="shopDescriptionInput"
                  {...register('productListDescription')}
                />
              </div>
            </div>
          </div>
          <div className="inputButtons">
            <input
              className="inputSubmitButton"
              type="submit"
              value={isUpdating ? '저장하기' : '추가하기'}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default HairMakeupShopForm;
