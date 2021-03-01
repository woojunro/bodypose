import React, { useState } from 'react';
import { createHistory } from 'history';
import ReactGA from 'react-ga';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { clearTokenAndCache } from '../apollo';

import HomeScreenM from '../screens/mobileScreens/HomeScreen';
import StudioInfoScreenM from '../screens/mobileScreens/StudioInfoScreen';
import StudioListScreenM from '../screens/mobileScreens/StudioListScreen';
import ConceptListScreenM from '../screens/mobileScreens/ConceptListScreen';
import ReviewListScreenM from '../screens/mobileScreens/ReviewListScreen';
import UserScreenM from '../screens/mobileScreens/AboutUser/UserScreen';
import HeartScreenM from '../screens/mobileScreens/HeartScreen';
import NoticeListScreenM from '../screens/mobileScreens/NoticeListScreen';
import NoticeScreenM from '../screens/mobileScreens/NoticeScreen';
import ErrorScreenM from '../screens/mobileScreens/ErrorScreen';

import LoginScreenM from '../screens/mobileScreens/AboutAuth/LoginScreen';
import ChangePasswordScreenM from '../screens/mobileScreens/AboutAuth/ChangePasswordScreen';
import StartWithEmailScreenM from '../screens/mobileScreens/AboutAuth/StartWithEmailScreen';
import MyInfoScreenM from '../screens/mobileScreens/AboutUser/MyInfoScreen';
import MyReviewScreenM from '../screens/mobileScreens/AboutUser/MyReviewScreen';
import LeaveScreenM from '../screens/mobileScreens/AboutUser/LeaveScreen';
import NewPasswordScreenM from '../screens/mobileScreens/AboutAuth/NewPasswordScreen';
import ConfirmEmailScreenM from '../screens/mobileScreens/AboutAuth/ConfirmEmailScreen';
import KakaoLinkScreenM from '../screens/mobileScreens/KakaoLinkScreen';
import NaverLoginCallbackScreenM from '../screens/mobileScreens/AboutAuth/NaverLoginCallbackScreen';
import ChangeNameScreenM from '../screens/mobileScreens/AboutUser/ChangeNameScreen';

import LoginContext from '../contexts/LoginContext';
import { MY_PROFILE_QUERY } from '../gql/queries/MyProfileQuery';

import './App.css';
import AppLoadingScreen from './mobileComponents/AppLoadingScreen';

ReactGA.initialize('UA-190823210-1');
const history = createHistory(window);

const App = () => {
  history.listen((location) => {
    window.ga('set', 'page', location.pathname + location.search);
    window.ga('send', 'pageview');
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const loggedInValue = { loggedIn, setLoggedIn };

  const { loading } = useQuery(MY_PROFILE_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data.myProfile.ok) {
        setLoggedIn(true);
      }
    },
    onError: (err) => {
      clearTokenAndCache();
    },
  });

  if (loading) {
    return (
      <div className="appFullScreen">
        <AppLoadingScreen big />
      </div>
    );
  }

  return (
    <LoginContext.Provider value={loggedInValue}>
      <Router history={history}>
        <Switch className="app">
          <Route exact path="/" component={HomeScreenM} />
          <Route exact path="/studios" component={StudioListScreenM} />
          <Route exact path="/concepts" component={ConceptListScreenM} />

          <Route exact path="/reviews" component={ReviewListScreenM} />
          <Route exact path="/studios/:slug" component={StudioInfoScreenM} />
          <Route exact path="/users" component={UserScreenM} />
          <Route exact path="/hearts" component={HeartScreenM} />
          <Route exact path="/notices" component={NoticeListScreenM} />
          <Route path="/notices/:noticeId" component={NoticeScreenM} />
          <Route path="/newPassword/:authCode" component={NewPasswordScreenM} />

          <Route exact path="/login" component={LoginScreenM} />
          <Route
            path="/login/naver/callback"
            component={NaverLoginCallbackScreenM}
          />
          <Route
            exact
            path="/changePassword"
            component={ChangePasswordScreenM}
          />
          <Route exact path="/changeName" component={ChangeNameScreenM} />
          <Route
            exact
            path="/startWithEmail"
            component={StartWithEmailScreenM}
          />
          <Route
            exact
            path="/confirmEmail/:code"
            component={ConfirmEmailScreenM}
          />
          <Route exact path="/users/myInfo" component={MyInfoScreenM} />
          <Route exact path="/users/myReview" component={MyReviewScreenM} />

          <Route exact path="/users/leave" component={LeaveScreenM} />
          <Route exact path="/error" component={ErrorScreenM} />
          <Route path="/kakaoLink/:kakaoID" component={KakaoLinkScreenM} />

          <Route path="*" component={ErrorScreenM} />
        </Switch>
      </Router>
    </LoginContext.Provider>
  );
};

export default App;
