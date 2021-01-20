import React from 'react';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

const LoadingSpinner = ({ loading }) => {
  return loading ? (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
    </div>
  ) : null;
};

export default LoadingSpinner;
