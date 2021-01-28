import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import HomeScreenM from '../screens/mobileScreens/HomeScreen';
import StudioInfoScreenM from '../screens/mobileScreens/StudioInfoScreen';
import StudioListScreenM from '../screens/mobileScreens/StudioListScreen';
import ConceptListScreenM from '../screens/mobileScreens/ConceptListScreen';
import AboutM from '../screens/mobileScreens/AboutScreen.js';
import ReviewListScreenM from '../screens/mobileScreens/ReviewListScreen';
import UserScreenM from '../screens/mobileScreens/AboutUser/UserScreen';
import HeartScreenM from '../screens/mobileScreens/HeartScreen';
import NoticeListScreenM from '../screens/mobileScreens/NoticeListScreen';
import NoticeScreenM from '../screens/mobileScreens/NoticeScreen';
import ErrorScreenM from '../screens/mobileScreens/ErrorScreen';
import FullReviewScreenM from '../screens/mobileScreens/FullReviewScreen';

import LoginScreenM from '../screens/mobileScreens/AboutAuth/LoginScreen';
import ChangePasswordScreenM from '../screens/mobileScreens/AboutAuth/ChangePasswordScreen';
import StartWithEmailScreenM from '../screens/mobileScreens/AboutAuth/StartWithEmailScreen';
import SnsInfoScreenM from '../screens/mobileScreens/AboutAuth/SnsInfoScreen';
import MyInfoScreenM from '../screens/mobileScreens/AboutUser/MyInfoScreen';
import MyReviewScreenM from '../screens/mobileScreens/AboutUser/MyReviewScreen';
import LeaveScreenM from '../screens/mobileScreens/AboutUser/LeaveScreen';
import NewPasswordScreenM from '../screens/mobileScreens/AboutAuth/NewPasswordScreen';

import LoginContext from '../contexts/LoginContext';

const App = () => {
  const [logedIn, setLogedIn] = useState(false);
  const logedInValue = { logedIn, setLogedIn };

  return (
    <LoginContext.Provider value={logedInValue}>
      <Router>
        <div className="app">
          <Route exact path="/" component={HomeScreenM} />
          <Route path="/about" component={AboutM} />
          <Route exact path="/studios" component={StudioListScreenM} />
          <Route exact path="/concepts" component={ConceptListScreenM} />

          <Route exact path="/reviews" component={ReviewListScreenM} />
          <Route exact path="/studios/:id" component={StudioInfoScreenM} />
          <Route exact path="/users" component={UserScreenM} />
          <Route exact path="/hearts" component={HeartScreenM} />
          <Route exact path="/notices" component={NoticeListScreenM} />
          <Route path="/notices/:noticeNumber" component={NoticeScreenM} />
          <Route path="/reviews/:reviewNumber" component={FullReviewScreenM} />
          <Route path="/NewPassword/:authCode" component={NewPasswordScreenM} />

          <Route exact path="/login" component={LoginScreenM} />
          <Route
            exact
            path="/changePassword"
            component={ChangePasswordScreenM}
          />
          <Route
            exact
            path="/startWithEmail"
            component={StartWithEmailScreenM}
          />
          <Route exact path="/snsInfo" component={SnsInfoScreenM} />
          <Route exact path="/users/myInfo" component={MyInfoScreenM} />
          <Route exact path="/users/myReview" component={MyReviewScreenM} />

          <Route exact path="/users/leave" component={LeaveScreenM} />
          <Route exact path="/error" component={ErrorScreenM} />
        </div>
      </Router>
    </LoginContext.Provider>
  );
};

export default App;
