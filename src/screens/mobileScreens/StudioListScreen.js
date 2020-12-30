import React from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';

const StudioListScreen = () => {
  return (
    <div>
      <Header pageName="home" />
      StudioList
      <BottomNavigation pageName="studios" />
    </div>
  );
};

export default StudioListScreen;
