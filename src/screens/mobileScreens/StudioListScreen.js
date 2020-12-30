import React from 'react';
import { BottomBox } from '../../components/mobileComponents/BottomBox';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';

const StudioListScreen = () => {
  return (
    <div>
      <Header pageName="home" />
      StudioList
      <BottomBox />
      <BottomNavigation pageName="studios" />
    </div>
  );
};

export default StudioListScreen;
