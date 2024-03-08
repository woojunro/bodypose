import React, { useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import './InfoToggleDiv.css';

const InfoToggleDiv = ({ title, content, openDefault = true }) => {
  const [isOpen, setIsOpen] = useState(openDefault);
  const renderedArrow = () => {
    return isOpen ? (
      <IoMdArrowDropup fontSize="17px" />
    ) : (
      <IoMdArrowDropdown fontSize="17px" />
    );
  };

  return (
    <div className="categoryContainer">
      <div onClick={() => setIsOpen(!isOpen)} className="categoryTitle">
        {title}
        {renderedArrow()}
      </div>
      {isOpen ? (
        <>
          <div className="parkingText">{content}</div>
        </>
      ) : null}
    </div>
  );
};
export default InfoToggleDiv;
