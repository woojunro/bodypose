import React, { useContext, useState } from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';
import LoginContext from '../../contexts/LoginContext';
import { Redirect, useHistory } from 'react-router-dom';
import HeartStudios from '../../components/mobileComponents/HeartsScreen/HeartStudios';
import HeartConcepts from '../../components/mobileComponents/HeartsScreen/HeartConcepts';

import { MakingPickContainer } from '../../components/functions/Heart/PickFunctions';
import './HeartScreen.css';

const HeartScreen = () => {
  const LoggedIn = useContext(LoginContext);
  const history = useHistory();

  const [pick, setPick] = useState('studio');

  if (!LoggedIn.loggedIn) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { previousPath: history.location.pathname },
        }}
      />
    );
  } else {
    const PickContainer = MakingPickContainer(pick, setPick);

    return (
      <div>
        <Header pageName="hearts" />
        {PickContainer}
        {pick === 'studio' ? <HeartStudios /> : <HeartConcepts />}
        <BottomNavigation pageName="hearts" />
      </div>
    );
  }
};

export default HeartScreen;
