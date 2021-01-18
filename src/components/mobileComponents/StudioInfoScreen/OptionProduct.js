import React from 'react';
import './OptionProduct.css';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { GetOptionProduct } from '../../functions/WithDb/StudioInfo';

const OptionProduct = ({ currentStudio, isOptionOpen, setIsOptionOpen }) => {
  const options = GetOptionProduct(currentStudio.studioName);
  const optionPrice = options.prices;
  const optionNotice = options.optionNotice;

  const renderedOptions = optionPrice.map((option) => {
    return (
      <div key={option.title} className="optionContainer">
        <div className="optionCardTop">
          <div className="optionTitle">{option.title}</div>
          <div className="optionPrice">{option.price}</div>
        </div>
        <div className="optionAdding">{option.adding}</div>
      </div>
    );
  });
  const renderedOptionNotice = optionNotice.map((notice) => {
    return (
      <div key={notice} className="itemNotice">
        *{notice}
      </div>
    );
  });

  const renderedArrow = () => {
    return isOptionOpen ? (
      <IoMdArrowDropup fontSize="17px" />
    ) : (
      <IoMdArrowDropdown fontSize="17px" />
    );
  };

  return (
    <div className="categoryContainer">
      <div
        onClick={() => setIsOptionOpen(!isOptionOpen)}
        className="categoryTitle"
      >
        추가상품{renderedArrow()}
      </div>
      {isOptionOpen ? (
        <>
          <div className="optionTotalContainer">{renderedOptions}</div>
          <div className="optionLine" />
          {renderedOptionNotice}
        </>
      ) : null}
    </div>
  );
};
export default OptionProduct;
