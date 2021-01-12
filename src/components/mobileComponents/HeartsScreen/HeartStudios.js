import React from 'react';
import StudioListView from '../../../components/mobileComponents/studioListScreen/StudioListView';

import { GetHeartedStudio } from '../../functions/WithDb/Heart';

const HeartStudio = () => {
  const studios = GetHeartedStudio();

  return (
    <div>
      <StudioListView studioList={studios} isHeartView={true} />
    </div>
  );
};

export default HeartStudio;
