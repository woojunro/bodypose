import React, { useState } from 'react';
import MyStudioStats from './MyStudioStats';
import OtherStats from './OtherStats';
import './StudioStats.css';

const StudioStats = () => {
  const [isByMonth, setIsByMonth] = useState(false);

  return (
    <div>
      <MyStudioStats isByMonth={isByMonth} setIsByMonth={setIsByMonth} />
      <OtherStats isByMonth={isByMonth} />
    </div>
  );
};

export default StudioStats;
