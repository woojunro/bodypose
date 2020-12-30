import React from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';

const HeartScreen = () => {
  return (
    <div>
      <Header pageName="home" />
      HeartList
      <BottomNavigation pageName="hearts" />
    </div>
  );
};

export default HeartScreen;
