import React from 'react';
import { BottomBox } from '../../components/mobileComponents/BottomBox';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';

const UserScreen = () => {
  return (
    <div>
      <Header pageName="home" />
      UserList
      <BottomBox />
      <BottomNavigation pageName="users" />
    </div>
  );
};

export default UserScreen;
