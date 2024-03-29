import React, { useState, useEffect } from 'react';

import './InputForm.css';

const InputForm = ({ onInputSubmit, placeholder, type, initialValue = '' }) => {
  const [term, setTerm] = useState(initialValue);

  useEffect(() => {
    onInputSubmit(term);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
