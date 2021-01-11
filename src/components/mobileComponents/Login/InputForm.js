import React, { useState, useEffect } from 'react';

import './InputForm.css';

const InputForm = ({ onInputSubmit, placeholder, type }) => {
  const [term, setTerm] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onInputSubmit(term);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [term]);
  return (
    <div className="loginInputField">
      <input
        placeholder={placeholder}
        className="loginInput"
        autoFocus={false}
        value={term}
        type={type}
        onChange={(e) => setTerm(e.target.value)}
      />
    </div>
  );
};

export default InputForm;
