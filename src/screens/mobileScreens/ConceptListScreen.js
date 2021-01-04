import React from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';

const ConceptListScreen = () => {
  return (
    <div>
      <Header pageName="concepts" />
      ConceptList
      <BottomNavigation pageName="concepts" />
    </div>
  );
};

export default ConceptListScreen;
