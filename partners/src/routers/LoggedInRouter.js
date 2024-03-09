import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

import Dashboard from '../screens/Dashboard';
import FullNoticeScreen from '../screens/FullNoticeScreen';
import MyInfoScreen from '../screens/MyInfoScreen';
import NewsScreen from '../screens/NewsScreen';
import NoticeScreen from '../screens/NoticeScreen';
import PhotoScreen from '../screens/PhotoScreen';
import HairMakeupScreen from '../screens/ProductScreens/HairMakeupScreen';
import OptionalProductScreen from '../screens/ProductScreens/OptionalProductScreen';
import ProductGeneralScreen from '../screens/ProductScreens/ProductGeneralScreen';
import ShootingProductScreen from '../screens/ProductScreens/ShootingProductScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import StudioInfoScreen from '../screens/StudioInfoScreen';
import ChangePasswordScreen from '../screens/AuthScreens/ChangePasswordScreen';
import useMyStudio from '../hooks/useMyStudio';
import LoadingScreen from '../screens/LoadingScreen';
import Header from '../components/Header';
import MenuBar from '../components/menuBar/MenuBar';
import StudioBranchScreen from '../screens/StudioBranchScreen';

export const STUDIO_PATH_PREFIX = '/studio';
export const PRODUCTS_PATH_PREFIX = '/products';

export const LoggedInPaths = {
  DASHBOARD: '/',
  MY_INFO: '/my/info',
  STUDIO_INFO: `${STUDIO_PATH_PREFIX}/info`,
  STUDIO_BRANCH: `${STUDIO_PATH_PREFIX}/branches`,
  CHANGE_PASSWORD: '/change-password',
  NEWS: '/news',
  NOTICE: '/notices',
  NOTICE_DETAIL: '/notices/:noticeId',
  STATISTICS: '/statistics',
  PRODUCT_GENERAL: `${PRODUCTS_PATH_PREFIX}/general`,
  STUDIO_PRODUCT: `${PRODUCTS_PATH_PREFIX}/studio`,
  OUTDOOR_PRODUCT: `${PRODUCTS_PATH_PREFIX}/outdoor`,
  HAIR_MAKEUP: `${PRODUCTS_PATH_PREFIX}/hair-makeup`,
  OPTIONAL_PRODUCT: `${PRODUCTS_PATH_PREFIX}/optional`,
  PHOTO: '/photo',
  REFRESH: '/refresh',
};

const loggedInRoutes = [
  { path: LoggedInPaths.DASHBOARD, component: <Dashboard /> },
  { path: LoggedInPaths.MY_INFO, component: <MyInfoScreen /> },
  { path: LoggedInPaths.STUDIO_INFO, component: <StudioInfoScreen /> },
  { path: LoggedInPaths.STUDIO_BRANCH, component: <StudioBranchScreen /> },
  { path: LoggedInPaths.CHANGE_PASSWORD, component: <ChangePasswordScreen /> },
  { path: LoggedInPaths.NEWS, component: <NewsScreen /> },
  { path: LoggedInPaths.NOTICE, component: <NoticeScreen /> },
  { path: LoggedInPaths.NOTICE_DETAIL, component: <FullNoticeScreen /> },
  { path: LoggedInPaths.STATISTICS, component: <StatisticsScreen /> },
  { path: LoggedInPaths.PRODUCT_GENERAL, component: <ProductGeneralScreen /> },
  { path: LoggedInPaths.STUDIO_PRODUCT, component: <ShootingProductScreen /> },
  {
    path: LoggedInPaths.OUTDOOR_PRODUCT,
    component: <ShootingProductScreen outdoor />,
  },
  { path: LoggedInPaths.HAIR_MAKEUP, component: <HairMakeupScreen /> },
  {
    path: LoggedInPaths.OPTIONAL_PRODUCT,
    component: <OptionalProductScreen />,
  },
  { path: LoggedInPaths.PHOTO, component: <PhotoScreen /> },
  { path: LoggedInPaths.REFRESH, component: null },
];

const LoggedInRouter = () => {
  const { loading } = useMyStudio();

  return loading ? (
    <LoadingScreen fullscreen />
  ) : (
    <Router>
      <ScrollToTop />
      <Header />
      <MenuBar />
      <Switch>
        {loggedInRoutes.map(route => (
          <Route exact key={route.path} path={route.path}>
            {route.component}
          </Route>
        ))}
        <Route>
          <Redirect to={LoggedInPaths.DASHBOARD} />
        </Route>
      </Switch>
    </Router>
  );
};

export default LoggedInRouter;
