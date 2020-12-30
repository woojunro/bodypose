import React from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';

const UserScreen = () => {
  return (
    <div>
      <Header pageName="home" />
      UserList
      <BottomNavigation pageName="users" />
    </div>
  );
};

export default UserScreen;
