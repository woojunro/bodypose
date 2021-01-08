import React from 'react';
import Header from '../../components/mobileComponents/StudioInfoScreen/InfoHeader';
import { DbStudios } from '../../virtualDB/items/DbStudios';
import './StudioInfoScreen.css';

const StudioInfoScreen = ({ match }) => {
  const currentStudio = DbStudios.find(
    (studio) => studio.studioName === match.params.id
  );

  return (
    <div>
      <Header />
      {match.params.id}번 스튜디오 정보이다.
    </div>
  );
};

export default StudioInfoScreen;
