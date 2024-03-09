import React from 'react';
import './JoinInput.css';

const JoinInput = ({
  title,
  description,
  initialValue = '',
  value = '',
  onInputSubmit,
  placeholder = '답변',
  type = '',
}) => {
  return (
    <div className="joinInputBox">
      <div>
        <span className="joinInputTitle">{title}</span>
        <span className="joinInputDescription">{description}</span>
      </div>
      <input
        placeholder={placeholder}
        className="joinAnswer"
        autoFocus={false}
        value={value}
        type={type}
        onChange={e => onInputSubmit(e.target.value)}
      />
    </div>
  );
};

export default JoinInput;
