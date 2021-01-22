import React from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import { IoIosArrowDown } from 'react-icons/io';

const SortButton = ({
  open,
  close,
  isOpen,
  openModal,
  closeModal,
  selectedOption,
}) => {
  return (
    <>
      {!isOpen ? (
        <button
          onClick={() => {
            open();
          }}
          className="sortByButtomClose"
        >
          <span className="textClose">{selectedOption.title}</span>
          <IoIosArrowDown className="arrowDown" fontSize="19px" />
        </button>
      ) : (
        <button
          onClick={() => {
            close();
          }}
          className="sortByButtomOpen"
        >
          <span className="textOpen">{selectedOption.title}</span>
          <IoIosArrowUp className="arrowUp" fontSize="19px" color="white" />
        </button>
      )}
    </>
  );
};

export default SortButton;
