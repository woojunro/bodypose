import React, { useState, useEffect } from 'react';

import './InputForm.css';

const InputForm = ({ onInputSubmit, placeholder, type, initialValue = '' }) => {
  const [term, setTerm] = useState('');

  useEffect(() => {
    if (initialValue.length > 0) setTerm(initialValue);
  }, []);

  useEffect(() => {
    onInputSubmit(term);
  }, [term]);

  return (
    <div className="loginInputField">
      <input
        placeholder={placeholder}
        className="loginInput"
        autoFocus={false}
        value={term}
        type={type}
        onChange={e => setTerm(e.target.value)}
      />
    </div>
  );
};

export default InputForm;
