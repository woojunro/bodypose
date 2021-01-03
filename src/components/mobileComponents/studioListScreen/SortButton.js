import React, { useState, useEffect } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import { IoIosArrowDown } from 'react-icons/io';
import Modal from './SortbyModal';

import './SortButton.css';

const SortButton = ({
  closeAnother,
  open,
  close,
  isOpen,
  options = [],
  setOption,
  selectedOption,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    isOpen === false ? closeModal() : openModal();
  }, [isOpen]);

  return (
    <>
      {!isOpen ? (
        <button
          onClick={() => {
            closeAnother();
            open();
            openModal();
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
            closeModal();
          }}
          className="sortByButtomOpen"
        >
          <span className="textOpen">{selectedOption.title}</span>
          <IoIosArrowUp className="arrowUp" fontSize="19px" color="white" />
        </button>
      )}
      <Modal
        isOpen={isModalOpen}
        close={closeModal}
        closeSortBy={close}
        options={options}
        setOption={setOption}
        selectedOption={selectedOption}
      />
    </>
  );
};

export default SortButton;
