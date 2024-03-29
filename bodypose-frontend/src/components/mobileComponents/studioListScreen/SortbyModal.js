import React, { useState } from 'react';
import { IoIosCheckmark } from 'react-icons/io';
import './SortbyModal.css';

const Modal = ({
  isOpen,
  close,
  closeSortBy,
  options = [],
  setOption,
  selectedOption,
}) => {
  const [selected, setSelected] = useState(selectedOption);
  const handleOption = option => {
    setOption(option);
    setSelected(option);
  };
  const renderedOptions = options.map(option => {
    if (option.title === selected.title) {
      return (
        <div key={option.title} className="selectedBox">
          <div>{option.title}</div> <IoIosCheckmark fontSize="30px" />
        </div>
      );
    }
    return (
      <div
        key={option.title}
        className="unselectedBox"
        onClick={() => {
          handleOption(option);
          setTimeout(() => {
            close();
            closeSortBy();
          }, 100); //정렬 되는 시간을 위해서 0.05초 텀을 둠.
        }}
      >
        <div>{option.title}</div>
      </div>
    );
  });
  return (
    <>
      {isOpen ? (
        ////만약 isopen(this.state.isModalOpen)이 true일때 코드를 실행 false면  null
        /// <div onClick={close}> 회색 바탕을 누를시 모달이 꺼지게 만듬
        ////<div className="modalContents" onClick={(e) => e.stopPropagation()}>
        /// 이 범위의 이벤트는 상위로 전이 막음.

        <div className="sortBymodal">
          <div
            className="sortBygreyBackground"
            onClick={() => {
              close();
              closeSortBy();
            }}
          >
            <div className="sortBytrueModal">
              <div
                className="sortBymodalContents"
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                {renderedOptions}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
