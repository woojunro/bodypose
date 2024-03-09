import React, { useEffect, useRef } from 'react';
import './AutoHeightTextarea.css';

const AutoHeightTextarea = ({ value = '', setValue = () => {} }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current.style.height = '0px';
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + 'px';
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="autoHeightTextarea"
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
};

export default AutoHeightTextarea;
