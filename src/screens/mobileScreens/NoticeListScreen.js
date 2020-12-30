import React from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';

const NoticeListScreen = () => {
  return (
    <div>
      <Header pageName="home" />
      NoticeList
      <BottomNavigation pageName="users" />
    </div>
  );
};

export default NoticeListScreen;
