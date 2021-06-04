import React, { useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import './StudioMap.css';
import KakaoMap from './KakaoMap';

const StudioMap = ({ currentStudio }) => {
  const [isMapOpen, setIsMapOpen] = useState(true);
  const address = currentStudio.branches;

  const renderedArrow = () => {
    return isMapOpen ? (
      <IoMdArrowDropup fontSize="17px" />
    ) : (
      <IoMdArrowDropdown fontSize="17px" />
    );
  };
  const renderedTitle = address.map((adr) => {
    return (
      <div key={`kakaomap-${adr.name}`} className="studioAdress">
        <span className="adressTitle">{adr.name}</span>
        <span className="adressInfo"> {adr.address}</span>
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
            <KakaoMap currentLocation={address} />
          </div>
        </>
      ) : null}
    </div>
  );
};
export default StudioMap;
