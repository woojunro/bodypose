import React from 'react';
import './column-header.css';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router';

const ColumnHeader = () => {
  const history = useHistory();
  return (
    <>
      <div className="column-header">
        <FiArrowLeft
          className="column-header-arrow"
          onClick={() => {
            history.goBack();
          }}
        />
        <div className="column-header-title">매거진</div>
      </div>
      <div style={{ height: '50px' }} />
    </>
  );
};

export default ColumnHeader;
