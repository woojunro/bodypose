import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

import LoginScreen from '../screens/AuthScreens/LoginScreen';
import JoinScreen from '../screens/AuthScreens/JoinScreen';

export const LoggedOutPaths = {
  LOGIN: '/',
  JOIN: '/join',
};

const loggedOutRoutes = [
  { path: LoggedOutPaths.LOGIN, component: <LoginScreen /> },
  { path: LoggedOutPaths.JOIN, component: <JoinScreen /> },
];

const LoggedOutRouter = () => (
  <Router>
    <ScrollToTop />
    <Switch>
      {loggedOutRoutes.map(route => (
        <Route exact key={route.path} path={route.path}>
          {route.component}
        </Route>
      ))}
      <Route>
        <Redirect to={LoggedOutPaths.LOGIN} />
      </Route>
    </Switch>
  </Router>
);

export default LoggedOutRouter;
