import React, { useEffect, useRef, useState } from 'react';
import './WeekTag.css';

const WeekTag = ({ currentStatus, setCurrentStatus }) => {
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) inputRef.current.focus();
  }, [isEditing]);

  return !isEditing ? (
    <div className="weekTagContainer">
      <div className="weekTagTitle">{currentStatus}</div>
      <div className="weekTagChange" onClick={() => setIsEditing(true)}>
        수정하기
      </div>
    </div>
  ) : (
    <div className="weekTagContainer">
      <input
        ref={inputRef}
        className="weekTagInput"
        type="text"
        placeholder="최대 5자"
        maxLength={5}
        defaultValue={currentStatus}
      />
      <div
        className="weekTagChange"
        onClick={() => {
          setCurrentStatus(inputRef.current.value);
          setIsEditing(false);
        }}
      >
        완료
      </div>
    </div>
  );
};

export default WeekTag;
