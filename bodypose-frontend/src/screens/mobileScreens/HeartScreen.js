import React, { useState } from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';
import { Redirect, useHistory } from 'react-router-dom';
import HeartStudios from '../../components/mobileComponents/HeartsScreen/HeartStudios';
import HeartConcepts from '../../components/mobileComponents/HeartsScreen/HeartConcepts';

import { MakingPickContainer } from '../../components/functions/Heart/PickFunctions';
import './HeartScreen.css';
import { useReactiveVar } from '@apollo/client';
import { IsLoggedInVar } from '../../apollo';

const HeartScreen = () => {
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const history = useHistory();

  const [pick, setPick] = useState('studio');

  if (!isLoggedIn) {
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
