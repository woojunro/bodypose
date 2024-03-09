import React from 'react';
import './SaveButtons.css';
import ChangeButton from './ChangeButton';

const SaveButtons = ({ saveData, refresh, isActive = true }) => {
  return (
    <div className="saveButtonsContainer">
      <div className="saveButtons">
        <ChangeButton
          onClick={() => refresh()}
          isGray={true}
          buttonName="모두 되돌리기"
        />
        <ChangeButton
          onClick={() => saveData()}
          isActive={isActive}
          buttonName="저장하기"
        />
      </div>
    </div>
  );
};

export default SaveButtons;
