import React from 'react';
import './OptionProduct.css';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { GetOptionProduct } from '../../functions/WithDb/StudioInfo';

const OptionProduct = ({ currentStudio, isOptionOpen, setIsOptionOpen }) => {
  const options = GetOptionProduct(currentStudio.studioName);

  const renderedOptions = options.map((option) => {
    return (
      <div className="optionContainer">
        <div className="optionCardTop">
          <div className="optionTitle">{option.title}</div>
          <div className="optionPrice">{option.price}</div>
        </div>
        <div className="optionAdding">{option.adding}</div>
      </div>
    );
  });

  const renderedArrow = () => {
    return isOptionOpen ? (
      <IoMdArrowDropup fontSize="15px" />
    ) : (
      <IoMdArrowDropdown fontSize="15px" />
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
        <div className="optionTotalContainer">{renderedOptions}</div>
      ) : null}
    </div>
  );
};
export default OptionProduct;
