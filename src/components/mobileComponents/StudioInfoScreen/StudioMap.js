import React, { useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import './StudioMap.css';
import Select from '../Common/Select';
import KakaoMap from './KakaoMap';

const StudioMap = ({ branches }) => {
  const branchOptions = branches.map(branch => ({
    value: branch.name,
    label: branch.name,
    address: branch.address,
  }));
  const [isMapOpen, setIsMapOpen] = useState(true);
  const [currentBranch, setCurrentBranch] = useState(branchOptions[0]);

  if (!branches.length) return null;

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
        <>
          <div className="MapTotalContainer">
            {branches.length > 1 && (
              <>
                <div className="branchCountText">지점 {branches.length}개</div>
                <Select
                  options={branchOptions}
                  currentOption={currentBranch}
                  setCurrentOption={setCurrentBranch}
                />
              </>
            )}
            <div className="studioAddressDiv">
              <span className="studioAddressLabel">주소</span>
              <span className="studioAddressText">{currentBranch.address}</span>
            </div>
            <KakaoMap
              key={currentBranch.address}
              currentLocation={currentBranch}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};
export default StudioMap;
