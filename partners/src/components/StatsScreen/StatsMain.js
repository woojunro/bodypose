import React, { useState } from 'react';
import './StatsMain.css';
import StatsNavigator from './StatsNavigator';
import StudioStats from './StudioStats';
import PhotoStats from './PhotoStats';

const StatsMain = () => {
  const [currentStat, setCurrentStat] = useState('studio');

  return (
    <>
      <StatsNavigator
        currentPick={currentStat}
        setCurrentPick={setCurrentStat}
      />
      {currentStat === 'studio' ? <StudioStats /> : <PhotoStats />}
    </>
  );
};

export default StatsMain;
