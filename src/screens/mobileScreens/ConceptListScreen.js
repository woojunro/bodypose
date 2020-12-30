import React from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';

const ConceptListScreen = () => {
  return (
    <div>
      <Header pageName="home" />
      ConceptList
      <BottomNavigation pageName="concepts" />
    </div>
  );
};

export default ConceptListScreen;
