import React, { useState, useEffect } from 'react';
import './ShootingProductForm.css';
import { useForm } from 'react-hook-form';
import {
  combineHoursMinutesToMinutes,
  splitMinutesToHoursMinutes,
} from '../function/products/time';
import {
  ConceptCountTypes,
  getConceptCounts,
  getConceptCountType,
} from '../function/products/conceptType';
import {
  PriceTypes,
  getPriceType,
  getPrice,
} from '../function/products/priceType';
import { INVALID_FORM } from '../../constants/errorMessages';

const ShootingProductForm = ({
  product = null,
  onSubmit = product => {},
  onCancel = () => {},
  weekdayPriceTag = '주중',
  weekendPriceTag = '주말',
}) => {
  const isUpdating = Boolean(product);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      peopleCount: 1,
      maxPeopleCount: 1,
      conceptCount: 1,
      maxConceptCount: 1,
      cutCount: 0,
      isOriginalProvided: false,
      weekdayPrice: 0,
      weekendPrice: 0,
      // 60 * hours + minutes = minuteCount
      hours: 0,
      minutes: 0,
      description: '',
    },
  });

  const onReset = () => {
    setConceptType(ConceptCountTypes.SINGLE_VALUE);
    setWeekdayPriceType(PriceTypes.VALUE);
    setWeekendPriceType(PriceTypes.VALUE);

    reset({
      title: '',
      peopleCount: 1,
      maxPeopleCount: 1,
      conceptCount: 1,
      maxConceptCount: 1,
      cutCount: 0,
      isOriginalProvided: false,
      weekdayPrice: 0,
      weekendPrice: 0,
      hours: 0,
      minutes: 0,
      description: '',
    });
  };

  useEffect(() => {
    if (isUpdating) {
      setConceptType(
        getConceptCountType(product.conceptCount, product.maxConceptCount)
      );
      setWeekdayPriceType(getPriceType(product.weekdayPrice));
      setWeekendPriceType(getPriceType(product.weekendPrice));

      const { hours, minutes } = splitMinutesToHoursMinutes(
        product.minuteCount
      );
      setValue('title', product.title);
      setValue('peopleCount', product.peopleCount);
      setValue('maxPeopleCount', product.maxPeopleCount);
      setValue('conceptCount', product.conceptCount);
      setValue('cutCount', product.cutCount);
      setValue('isOriginalProvided', product.isOriginalProvided);
      setValue('weekdayPrice', product.weekdayPrice);
      setValue('weekendPrice', product.weekendPrice);
      setValue('hours', hours);
      setValue('minutes', minutes);
      setValue('description', product.description);
    }
  }, [isUpdating, product, setValue]);

  const watchPeopleCount = watch('peopleCount');
  const watchConceptCount = watch('conceptCount');

  useEffect(() => {
    if (Number(watch('maxPeopleCount')) < Number(watchPeopleCount)) {
      setValue('maxPeopleCount', watchPeopleCount);
    }
  }, [watch, watchPeopleCount, setValue]);

  useEffect(() => {
    if (Number(watch('maxConceptCount')) < Number(watchConceptCount)) {
      setValue('maxConceptCount', watchConceptCount);
    }
  }, [watch, watchConceptCount, setValue]);

  const [conceptType, setConceptType] = useState(
    ConceptCountTypes.SINGLE_VALUE
  );
  const [weekdayPriceType, setWeekdayPriceType] = useState(PriceTypes.VALUE);
  const [weekendPriceType, setWeekendPriceType] = useState(PriceTypes.VALUE);

  const onFormSubmit = data => {
    const {
      title,
      peopleCount,
      maxPeopleCount,
      conceptCount,
      maxConceptCount,
      cutCount,
      isOriginalProvided,
      weekdayPrice,
      weekendPrice,
      hours,
      minutes,
      description,
    } = data;

    const conceptCounts = getConceptCounts(
      conceptType,
      conceptCount,
      maxConceptCount
    );

    onSubmit({
      title,
      peopleCount: Number(peopleCount),
      maxPeopleCount: maxPeopleCount ? Number(maxPeopleCount) : null,
      conceptCount: conceptCounts.conceptCount,
      maxConceptCount: conceptCounts.maxConceptCount,
      cutCount: Number(cutCount),
      isOriginalProvided: String(isOriginalProvided) === 'true',
      weekdayPrice: getPrice(weekdayPriceType, weekdayPrice),
      weekendPrice: getPrice(weekendPriceType, weekendPrice),
      minuteCount: combineHoursMinutesToMinutes(Number(hours), Number(minutes)),
      description,
    });

    if (product) onCancel();
    else onReset();
  };

  const onError = () => alert(INVALID_FORM);

  return (
    <form onSubmit={handleSubmit(onFormSubmit, onError)}>
      <div className="shootingProductFormContainer">
        <div className="shootingProductFormInputData">
          <div className="shootingProductFormInputDataTitle">* 상품명</div>
          <input
            className="shootingProductFormInputTitle"
            type="text"
            placeholder="최대 25자"
            required
            maxLength={25}
            {...register('title', { required: true, maxLength: 25 })}
          />
        </div>
        <div className="shootingProductFormInputData">
          <div className="shootingProductFormInputDataTitle">* 촬영 인원</div>
          <div className="shootingProductFormText">기준</div>
          <input
            className="shootingProductFormInputNumber"
            type="number"
            required
            min={1}
            {...register('peopleCount', { required: true, min: 1 })}
          />
          <div className="shootingProductFormText">명</div>
          <div className="shootingProductFormText">/</div>
          <div className="shootingProductFormText">최대</div>
          <input
            className="shootingProductFormInputNumber"
            type="number"
            min={watchPeopleCount}
            {...register('maxPeopleCount', {
              required: false,
              min: watchPeopleCount,
            })}
          />
          <div className="shootingProductFormText">명</div>
        </div>
        <div className="shootingProductFormInputData">
          <div className="shootingProductFormInputDataTitle">* 컨셉 수</div>
          <select
            className="shootingProductFormInputSelect"
            value={conceptType}
            onChange={e => setConceptType(e.target.value)}
          >
            {Object.keys(ConceptCountTypes).map(key => (
              <option key={key} value={ConceptCountTypes[key]}>
                {ConceptCountTypes[key]}
              </option>
            ))}
          </select>
          {(conceptType === ConceptCountTypes.SINGLE_VALUE ||
            conceptType === ConceptCountTypes.MULTI_VALUES) && (
            <>
              <input
                className="shootingProductFormInputNumber"
                type="number"
                required
                min={1}
                {...register('conceptCount', { required: true, min: 1 })}
              />
              {conceptType === ConceptCountTypes.MULTI_VALUES && (
                <>
                  <div className="shootingProductFormText">~</div>
                  <input
                    className="shootingProductFormInputNumber"
                    type="number"
                    min={watchConceptCount}
                    {...register('maxConceptCount', {
                      required: false,
                      min: watchConceptCount,
                    })}
                  />
                </>
              )}
              <div className="shootingProductFormText">컨셉</div>
            </>
          )}
        </div>
        <div className="shootingProductFormInputData">
          <div className="shootingProductFormInputDataTitle" type="number">
            * 보정본 컷 수
          </div>
          <input
            className="shootingProductFormInputNumber"
            required
            min={0}
            {...register('cutCount', { required: true, min: 0 })}
          />
          <div className="shootingProductFormText">컷</div>
        </div>
        <div className="shootingProductFormInputData">
          <div className="shootingProductFormInputDataTitle" type="number">
            * 원본 제공
          </div>
          <select
            className="shootingProductFormInputSelect"
            {...register('isOriginalProvided')}
          >
            <option value={true}>제공</option>
            <option value={false}>미제공</option>
          </select>
        </div>
        <div className="shootingProductFormInputData">
          <div className="shootingProductFormInputDataTitle">
            {`* ${weekdayPriceTag} 가격`}
          </div>
          <select
            className="shootingProductFormInputSelect"
            value={weekdayPriceType}
            onChange={e => setWeekdayPriceType(e.target.value)}
          >
            {Object.keys(PriceTypes).map(key => (
              <option key={key} value={PriceTypes[key]}>
                {PriceTypes[key]}
              </option>
            ))}
          </select>
          {weekdayPriceType === PriceTypes.VALUE && (
            <>
              <input
                className="shootingProductFormInputNumber shootingProductFormInputPrice"
                type="number"
                required
                min={0}
                {...register('weekdayPrice', { required: true, min: 0 })}
              />
              <div className="shootingProductFormText">원</div>
            </>
          )}
        </div>
        <div className="shootingProductFormInputData">
          <div className="shootingProductFormInputDataTitle">
            {`* ${weekendPriceTag} 가격`}
          </div>
          <select
            className="shootingProductFormInputSelect"
            value={weekendPriceType}
            onChange={e => setWeekendPriceType(e.target.value)}
          >
            {Object.keys(PriceTypes).map(key => (
              <option key={key} value={PriceTypes[key]}>
                {PriceTypes[key]}
              </option>
            ))}
          </select>
          {weekendPriceType === PriceTypes.VALUE && (
            <>
              <input
                className="shootingProductFormInputNumber shootingProductFormInputPrice"
                type="number"
                required
                min={0}
                {...register('weekendPrice', { required: true, min: 0 })}
              />
              <div className="shootingProductFormText">원</div>
            </>
          )}
        </div>
        <div className="shootingProductFormInputData">
          <div className="shootingProductFormInputDataTitle">소요 시간</div>
          <input
            className="shootingProductFormInputNumber"
            type="number"
            min={0}
            {...register('hours', { min: 0 })}
          />
          <div className="shootingProductFormText">시간</div>
          <input
            className="shootingProductFormInputNumber"
            type="number"
            min={0}
            max={59}
            {...register('minutes', { min: 0, max: 59 })}
          />
          <div className="shootingProductFormText">분</div>
          <div className="shootingProductFormText">내외</div>
        </div>
        <div className="shootingProductFormInputData">
          <div className="shootingProductFormInputDataTitle">추가 설명</div>
          <input
            className="shootingProductFormInputDescription"
            type="text"
            placeholder="(주의) 엔터키를 누르시면 입력하신 내용이 저장됩니다."
            maxLength={255}
            {...register('description', { maxLength: 255 })}
          />
        </div>
      </div>
      <div className="inputButtons">
        <div
          className="inputCancleButton"
          onClick={product ? onCancel : onReset}
        >
          {product ? '취소' : '초기화'}
        </div>
        <input
          className="inputSubmitButton"
          type="submit"
          value={product ? '저장' : '추가'}
        />
      </div>
    </form>
  );
};

export default ShootingProductForm;
