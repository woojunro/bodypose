import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ fullscreen = false }) => (
  <div className={`${fullscreen ? 'fullscreen' : 'Dashboard'} centeredDiv`}>
    <h1>Loading...</h1>
  </div>
);

export default LoadingScreen;
