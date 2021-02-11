import React from 'react';
import './TopNavigator.css';

const genderOptionsKor = ['전체', '남성', '여성', '커플'];

const TopNavigator = ({ options, selectedGender, setGender }) => {
  const renderdOption = options.map((option, idx) => {
    return option === selectedGender ? (
      <div key={`gender-option-selected-${option}`} className="selectedText">
        {genderOptionsKor[idx]}
      </div>
    ) : (
      <div
        key={`gender-option-unselected-${option}`}
        onClick={() => setGender(option)}
        className="unselectedText"
      >
        {genderOptionsKor[idx]}
      </div>
    );
  });

  return <div className="topNavigatorContainer">{renderdOption}</div>;
};

export default TopNavigator;
