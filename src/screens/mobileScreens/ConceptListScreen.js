import React from 'react';
import { BottomBox } from '../../components/mobileComponents/BottomBox';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';

const ConceptListScreen = () => {
  return (
    <div>
      <Header pageName="home" />
      ConceptList
      <BottomBox />
      <BottomNavigation pageName="concepts" />
    </div>
  );
};

export default ConceptListScreen;
