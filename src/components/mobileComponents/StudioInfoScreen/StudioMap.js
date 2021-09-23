import React, { useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import './StudioMap.css';
import Select from '../Common/Select';
import KakaoMap from './KakaoMap';

const StudioMap = ({ branches, studioName }) => {
  const branchOptions = branches.map(branch => ({
    value: branch.name,
    label: branch.name,
    ...branch,
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
                <div className="branchSelectContainer">
                  <Select
                    options={branchOptions}
                    currentOption={currentBranch}
                    setCurrentOption={setCurrentBranch}
                  />
                </div>
              </>
            )}
            <div className="studioAddressDivContainer">
              <div className="studioAddressDiv">
                <span className="studioAddressLabel">주소</span>
                <span className="studioAddressText">
                  {currentBranch.address}
                </span>
              </div>
            </div>
            <KakaoMap
              key={currentBranch.address}
              currentLocation={currentBranch}
              studioName={studioName}
              hasOnlyOneBranch={branches.length === 1}
            />
            {currentBranch.parkingInfo && (
              <div className="studioAddressDivContainer">
                <div className="studioAddressDiv">
                  <div className="studioParkingLabel">주차 정보</div>
                  <div className="studioParkingText">
                    {currentBranch.parkingInfo}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
export default StudioMap;
