import React, { useState } from 'react';
import './OptionButton.css';

const OptionButton = ({
  optionName,
  title,
  isSelected,
  deleteSelection,
  addSelection,
  checkTotal,
}) => {
  const [selected, setSelected] = useState(isSelected);
  return selected ? (
    <div
      className="selectedOptionContainer"
      onClick={() => {
        deleteSelection(optionName);
      }}
    >
      {title}
    </div>
  ) : (
    <div
      className="unselectedOptionContainer"
      onClick={() => {
        addSelection(optionName);
      }}
    >
      {title}
    </div>
  );
};

export default OptionButton;
