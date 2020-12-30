import React from 'react';
import Header from '../../components/mobileComponents/HeaderM';

const StudioInfoScreen = ({ match }) => {
  return (
    <div>
      <Header pageName="home" />
      {match.params.id}번 스튜디오 정보이다.
    </div>
  );
};

export default StudioInfoScreen;
