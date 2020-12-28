import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import HomeM from '../screens/mobileScreens/HomeScreen';
import About from '../screens/mobileScreens/AboutScreen.js';
const App = () => {
  ///가로 700픽셀 미만이면 모바일로 처리.
  const isPc = useMediaQuery({
    query: '(min-width:700px)',
  });
  if (isPc) {
    return <div>Pc</div>;
  } else {
    return (
      <Router>
        <div className="app">
          <Route exact path="/" component={HomeM} />
          <Route path="/about" component={About} />
        </div>
      </Router>
    );
  }
};

export default App;
