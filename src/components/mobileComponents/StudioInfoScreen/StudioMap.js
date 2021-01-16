import React, { useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import './StudioMap.css';
import KakaoMap from './KakaoMap';

const StudioMap = ({ currentStudio }) => {
  const [isMapOpen, setIsMapOpen] = useState(true);
  const adress = currentStudio.location;

  const renderedArrow = () => {
    return isMapOpen ? (
      <IoMdArrowDropup fontSize="17px" />
    ) : (
      <IoMdArrowDropdown fontSize="17px" />
    );
  };

  return (
    <div className="categoryContainer">
      <div onClick={() => setIsMapOpen(!isMapOpen)} className="categoryTitle">
        위치{renderedArrow()}
      </div>
      {isMapOpen ? (
        <div className="MapTotalContainer">
          <div className="studioAdress">{adress}</div>
          <div>
            <KakaoMap currentStudio={currentStudio} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default StudioMap;
