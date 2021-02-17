import React from 'react';
import './OptionProduct.css';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

const OptionProduct = ({
  currentStudio,
  products,
  isOptionOpen,
  setIsOptionOpen,
}) => {
  const optionNotice = currentStudio.additionalProductListDescription;

  const renderedOptions = products.map(option => {
    return (
      <div key={option.id} className="optionContainer">
        <div className="optionCardTop">
          <div className="optionTitle">{option.title}</div>
          <div className="optionPrice">{option.price.toLocaleString()}</div>
        </div>
        <div className="optionAdding">{option.description}</div>
      </div>
    );
  });
  const renderedOptionNotice = (optionNotice
    ? optionNotice.split('\n')
    : []
  ).map(notice => {
    return (
      <div key={notice} className="itemNotice">
        * {notice}
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
