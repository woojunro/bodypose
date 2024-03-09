import React from 'react';
import './GeneralSaveButton.css';
import Button from '../ChangeButton';

const GeneralSaveButton = ({ refresh, save, isActive = true }) => {
  return (
    <div className="buttonsContainer">
      <div className="buttons">
        <Button buttonName="모두 되돌리기" onClick={refresh} isGray />
        <Button buttonName="적용하기" onClick={save} isActive={isActive} />
      </div>
    </div>
  );
};

export default GeneralSaveButton;
