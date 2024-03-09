import React from 'react';
import './BottomAlertDialog.css';

const BottomAlertDialog = ({ isOpen, setIsOpen, dialog }) => {
  setTimeout(() => {
    setIsOpen(false);
  }, 2000);

  return isOpen ? (
    <div className="dialogContainer">
      <div className="dialog">{dialog}</div>
    </div>
  ) : null;
};

export default BottomAlertDialog;
