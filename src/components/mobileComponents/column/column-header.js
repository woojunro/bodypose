import React from 'react';
import './column-header.css';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router';

const ColumnHeader = () => {
  const history = useHistory();
  return (
    <>
      <div className="column-header">
        {/* 매거진 리스트면 홈으로, 매거진 읽는 중이라면 리스트로 보내기 */}
        <FiArrowLeft
          className="column-header-arrow"
          onClick={() => {
            window.location.pathname === '/columns'
              ? history.push('/')
              : history.push('/columns');
          }}
        />
        <div className="column-header-title">매거진</div>
      </div>
      <div style={{ height: '50px' }} />
    </>
  );
};

export default ColumnHeader;
