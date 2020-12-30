import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import HomeScreenM from '../screens/mobileScreens/HomeScreen';
import StudioInfoScreenM from '../screens/mobileScreens/StudioInfoScreen';
import StudioListScreenM from '../screens/mobileScreens/StudioListScreen';
import ConceptListScreenM from '../screens/mobileScreens/ConceptListScreen';
import AboutM from '../screens/mobileScreens/AboutScreen.js';
import ReviewListScreenM from '../screens/mobileScreens/ReviewListScreen';
import UserScreenM from '../screens/mobileScreens/UserScreen';
import HeartScreenM from '../screens/mobileScreens/HeartScreen';
import ConceptsInfoScreenM from '../screens/mobileScreens/ConceptsInfoScreen';
import NoticeListScreenM from '../screens/mobileScreens/NoticeListScreen';
import NoticeScreenM from '../screens/mobileScreens/NoticeScreen';
const App = () => {
  ///가로 900픽셀 미만이면 모바일로 처리.
  const isPc = useMediaQuery({
    query: '(min-width:900px)',
  });
  if (isPc) {
    return <div>Pc</div>;
  } else {
    return (
      <Router>
        <div className="app">
          <Route exact path="/" component={HomeScreenM} />
          <Route path="/about" component={AboutM} />
          <Route exact path="/studios" component={StudioListScreenM} />
          <Route exact path="/concepts" component={ConceptListScreenM} />
          <Route
            exact
            path="/concepts/:conceptNum"
            component={ConceptsInfoScreenM}
          />
          <Route exact path="/reviews" component={ReviewListScreenM} />
          <Route exact path="/studios/:id" component={StudioInfoScreenM} />
          <Route exact path="/users" component={UserScreenM} />
          <Route path="/hearts" component={HeartScreenM} />
          <Route exact path="/notices" component={NoticeListScreenM} />{' '}
          <Route path="/notices/:noticeNumber" component={NoticeScreenM} />
        </div>
      </Router>
    );
  }
};

export default App;
