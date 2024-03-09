import React from 'react';
import './help-icon.css';
import Tooltip from 'react-png-tooltip';

export const HelpIcon = ({ img }) => {
  return (
    <div className="helpIcon">
      <Tooltip className="helpTooltip" background="orange" fill="white">
        <img src={img} alt="" />
      </Tooltip>
    </div>
  );
};
