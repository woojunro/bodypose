import React from 'react';
import { BottomBox } from '../../components/mobileComponents/BottomBox';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';

const HeartScreen = () => {
  return (
    <div>
      <Header pageName="home" />
      HeartList
      <BottomBox />
      <BottomNavigation pageName="hearts" />
    </div>
  );
};

export default HeartScreen;
