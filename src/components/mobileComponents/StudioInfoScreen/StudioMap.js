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
  const renderedTitle = adress.map((adr) => {
    return (
      <div key={adr.title} className="studioAdress">
        <span className="adressTitle">{adr.title}</span>
        <span className="adressInfo"> {adr.adress}</span>
      </div>
    );
  });

  return (
    <div className="categoryContainer">
      <div onClick={() => setIsMapOpen(!isMapOpen)} className="categoryTitle">
        위치{renderedArrow()}
      </div>
      {isMapOpen ? (
        <>
          <div className="MapTotalContainer">
            {renderedTitle}
            <KakaoMap currentLocation={adress} />
          </div>
        </>
      ) : null}
    </div>
  );
};
export default StudioMap;
