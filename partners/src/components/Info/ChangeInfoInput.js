import React from 'react';
import './ChangeInfoInput.css';

const ChangeInfoInput = ({
  value = '',
  onChange = () => {},
  placeholder = '',
  ...inputProps
}) => {
  return (
    <div className="changeInfoContainer">
      <input
        className="changeInput"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        {...inputProps}
      />
      <div className="changeDiscription">
        화면 맨 아래 적용하기 버튼을 꼭 눌러주세요
      </div>
    </div>
  );
};

export default ChangeInfoInput;
