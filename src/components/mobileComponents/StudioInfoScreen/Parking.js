import React, { useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import './Parking.css';

const Parking = ({ currentStudio }) => {
  const [isParkingOpen, setIsParkingOpen] = useState(true);
  const renderedArrow = () => {
    return isParkingOpen ? (
      <IoMdArrowDropup fontSize="17px" />
    ) : (
      <IoMdArrowDropdown fontSize="17px" />
    );
  };
  return (
    <div className="categoryContainer">
      <div
        onClick={() => setIsParkingOpen(!isParkingOpen)}
        className="categoryTitle"
      >
        주차{renderedArrow()}
      </div>
      {isParkingOpen ? (
        <>
          <div className="parkingText">
            {currentStudio.parkingInfoDescription}
          </div>
        </>
      ) : null}
    </div>
  );
};
export default Parking;
