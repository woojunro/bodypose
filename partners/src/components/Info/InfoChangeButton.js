import React from 'react';
import './InfoChangeButton.css';
import Button from '../ChangeButton';

const InfoChangeButton = ({ refresh, onClick, isActive = true }) => (
  <div className="buttonsContainer">
    <div className="buttons">
      <Button buttonName="모두 되돌리기" onClick={refresh} isGray={true} />
      <Button buttonName="적용하기" onClick={onClick} isActive={isActive} />
    </div>
  </div>
);

export default InfoChangeButton;
