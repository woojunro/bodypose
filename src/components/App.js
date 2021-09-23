import React, { useState, useEffect } from 'react';
import Analytics from 'react-router-ga';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { IsLoggedInVar } from '../apollo';
import HomeScreenM from '../screens/mobileScreens/HomeScreen';
import StudioInfoScreenM from '../screens/mobileScreens/StudioInfoScreen';
import StudioListScreenM from '../screens/mobileScreens/StudioListScreen';
import StudioLocationScreenM from '../screens/mobileScreens/StudioLocationScreen';
import ConceptListScreenM from '../screens/mobileScreens/ConceptListScreen';
// import ReviewListScreenM from '../screens/mobileScreens/ReviewListScreen';
import UserScreenM from '../screens/mobileScreens/AboutUser/UserScreen';
import HeartScreenM from '../screens/mobileScreens/HeartScreen';
import NoticeListScreenM from '../screens/mobileScreens/NoticeListScreen';
import NoticeScreenM from '../screens/mobileScreens/NoticeScreen';
import ErrorScreenM from '../screens/mobileScreens/ErrorScreen';
import LoginScreenM from '../screens/mobileScreens/AboutAuth/LoginScreen';
import ChangePasswordScreenM from '../screens/mobileScreens/AboutAuth/ChangePasswordScreen';
import StartWithEmailScreenM from '../screens/mobileScreens/AboutAuth/StartWithEmailScreen';
import MyInfoScreenM from '../screens/mobileScreens/AboutUser/MyInfoScreen';
// import MyReviewScreenM from '../screens/mobileScreens/AboutUser/MyReviewScreen';
import LeaveScreenM from '../screens/mobileScreens/AboutUser/LeaveScreen';
import NewPasswordScreenM from '../screens/mobileScreens/AboutAuth/NewPasswordScreen';
import ConfirmEmailScreenM from '../screens/mobileScreens/AboutAuth/ConfirmEmailScreen';
import KakaoLinkScreenM from '../screens/mobileScreens/KakaoLinkScreen';
import KakaoPhoneScreenM from '../screens/mobileScreens/KakaoPhoneScreen';
import SocialLoginCallbackScreenM from '../screens/mobileScreens/AboutAuth/SocialLoginCallbackScreen';
import MyProfileScreenM from '../screens/mobileScreens/AboutUser/MyProfileScreen';
import CreateProfileScreenM from '../screens/mobileScreens/AboutUser/CreateProfileScreen';
import UpdateEmailScreenM from '../screens/mobileScreens/AboutUser/UpdateEmailScreen';
import './App.css';
import AppLoadingScreen from './mobileComponents/AppLoadingScreen';
import { MY_USER_INFO_QUERY } from '../gql/queries/MyUserInfoQuery';
import { shouldUpdateEmail } from '../constants/shouldUpdateEmail';
import LogoutScreen from '../screens/mobileScreens/LogoutScreen';
import { createBrowserHistory } from 'history';

const App = () => {
  const history = createBrowserHistory();
  const [isAppLoading, setIsAppLoading] = useState(true);
  //현재 위치.
  // const [currentAddr, setCurrentAddr] = useState();
  // const [declineGPS, setDeclineGPS] = useState();
  const [studiosLocation, setStudiosLocation] = useState();
  useEffect(() => {
    console.log(studiosLocation);
  }, [studiosLocation]);

  const { loading } = useQuery(MY_USER_INFO_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      IsLoggedInVar(true);
      const email = data.userInfo?.userInfo?.email;
      if (!email || shouldUpdateEmail(email)) {
        history.push('/updateEmail');
      } else if (!data.userInfo?.userInfo?.profile) {
        history.push('/createProfile');
      }
      setIsAppLoading(false);
    },
    onError: err => {
      IsLoggedInVar(false);
      setIsAppLoading(false);
    },
  });

  if (isAppLoading || loading) {
    return (
      <div className="appFullScreen">
        <AppLoadingScreen big />
      </div>
    );
  }

  return (
    <Router>
      <Analytics id={process.env.REACT_APP_GA_ID}>
        <Switch className="app">
          <Route exact path="/" component={HomeScreenM} />
          <Route
            exact
            path="/studios"
            component={() => (
              <StudioListScreenM
                setStudioLocation={setStudiosLocation}
                studiosLocation={studiosLocation}
                // addr={currentAddr}
                // setAddr={setCurrentAddr}
                // declineGPS={declineGPS}
                // setDeclineGPS={setDeclineGPS}
              />
            )}
          />
          <Route exact path="/concepts" component={ConceptListScreenM} />
          {/* <Route exact path="/reviews" component={ReviewListScreenM} /> */}
          <Route
            exact
            path="/studioslocation"
            component={() => (
              <StudioLocationScreenM setLocation={setStudiosLocation} />
            )}
          />
          <Route exact path="/studios/:slug" component={StudioInfoScreenM} />
          <Route exact path="/users" component={UserScreenM} />
          <Route exact path="/hearts" component={HeartScreenM} />
          <Route exact path="/notices" component={NoticeListScreenM} />
          <Route path="/notices/:noticeId" component={NoticeScreenM} />
          <Route exact path="/login" component={LoginScreenM} />
          <Route
            path="/login/:provider/callback"
            component={SocialLoginCallbackScreenM}
          />
          <Route exact path="/createProfile" component={CreateProfileScreenM} />
          <Route exact path="/updateEmail" component={UpdateEmailScreenM} />
          <Route
            exact
            path="/changePassword"
            component={ChangePasswordScreenM}
          />
          <Route path="/newPassword" component={NewPasswordScreenM} />
          <Route
            exact
            path="/startWithEmail"
            component={StartWithEmailScreenM}
          />
          <Route path="/confirmEmail" component={ConfirmEmailScreenM} />
          <Route exact path="/users/myInfo" component={MyInfoScreenM} />
          {/* <Route exact path="/users/myReview" component={MyReviewScreenM} /> */}
          <Route exact path="/users/leave" component={LeaveScreenM} />
          <Route exact path="/users/profile" component={MyProfileScreenM} />
          <Route exact path="/error" component={ErrorScreenM} />
          <Route path="/kakaoLink/:kakaoID" component={KakaoLinkScreenM} />
          <Route path="/kakaoPhone/:kakaoID" component={KakaoPhoneScreenM} />
          <Route exact path="/logout" component={LogoutScreen} />
          <Route component={ErrorScreenM} />
        </Switch>
      </Analytics>
    </Router>
  );
};

export default App;
