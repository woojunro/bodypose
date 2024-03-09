import './App.css';
import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { IsLoggedInVar } from './graphql/variables';
import useMyInfo from './hooks/useMyInfo';
import LoggedInRouter from './routers/LoggedInRouter';
import LoggedOutRouter from './routers/LoggedOutRouter';
import LoadingScreen from './screens/LoadingScreen';

const App = () => {
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const { loading } = useMyInfo();

  if (loading) return <LoadingScreen fullscreen />;

  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
};

export default App;
