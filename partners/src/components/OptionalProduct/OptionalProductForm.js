import React, { useEffect } from 'react';
import './OptionalProductForm.css';
import { useForm } from 'react-hook-form';
import { INVALID_FORM } from '../../constants/errorMessages';

const OptionalProductForm = ({
  product,
  onSubmit = product => {},
  onCancel = () => {},
}) => {
  const isUpdating = Boolean(product);

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: '',
      price: 0,
      description: '',
    },
  });

  const onReset = () => {
    reset({
      title: '',
      price: 0,
      description: '',
    });
  };

  useEffect(() => {
    if (isUpdating) {
      setValue('title', product.title);
      setValue('price', product.price);
      setValue('description', product.description);
    }
  }, [isUpdating, setValue, product]);

  const onFormSubmit = data => {
    const { title, price, description } = data;
    onSubmit({
      title,
      price: Number(price),
      description,
    });

    if (product) onCancel();
    else onReset();
  };

  const onError = () => alert(INVALID_FORM);

  return (
    <form onSubmit={handleSubmit(onFormSubmit, onError)}>
      <div>
        <div className="inputContainer">
          <div>
            <input
              className="inputTitle"
              type="text"
              required
              maxLength={50}
              {...register('title', { required: true, maxLength: 50 })}
              placeholder="* 상품명 (최대 50자)"
            />
          </div>
          <div className="inputDatas">
            <div className="inputData">
              <div className="inputDataTitle">* 가격</div>
              <input
                className="inputNumber"
                type="number"
                required
                min={0}
                {...register('price', { required: true, min: 0 })}
              />
            </div>
            <div className="inputData">
              <div className="inputDataTitle">상품 추가 설명</div>
              <input
                className="inputDescription"
                type="text"
                placeholder="(주의) 엔터키를 누르시면 입력하신 내용이 저장됩니다."
                maxLength={255}
                {...register('description', { maxLength: 255 })}
              />
            </div>
          </div>
        </div>
        <div className="inputButtons">
          <div
            className="inputCancleButton"
            onClick={isUpdating ? onCancel : onReset}
          >
            {isUpdating ? '취소' : '초기화'}
          </div>
          <input
            className="inputSubmitButton"
            type="submit"
            value={isUpdating ? '저장' : '추가'}
          />
        </div>
      </div>
    </form>
  );
};

export default OptionalProductForm;
