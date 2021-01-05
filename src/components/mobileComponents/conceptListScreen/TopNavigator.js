import React from 'react';
import './TopNavigator.css';

const TopNavigator = ({ options = [], selectedGender, setGender }) => {
  const renderdOption = options.map((option) => {
    return option === selectedGender ? (
      <div key={option} className="selectedText">
        {option}
      </div>
    ) : (
      <div
        key={option}
        onClick={() => setGender(option)}
        className="unselectedText"
      >
        {option}
      </div>
    );
  });

  return <div className="topNavigatorContainer">{renderdOption}</div>;
};

export default TopNavigator;
