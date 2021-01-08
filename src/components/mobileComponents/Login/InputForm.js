import React, { useState, useEffect } from 'react';

import './InputForm.css';

const InputForm = ({ onInputSubmit, title }) => {
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
        placeholder={title}
        className="loginInput"
        autoFocus={false}
        value={term}
        type={title === '비밀번호' ? 'password' : 'text'}
        onChange={(e) => setTerm(e.target.value)}
      />
    </div>
  );
};

export default InputForm;
