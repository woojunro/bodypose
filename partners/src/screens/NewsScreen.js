import React from 'react';
import './NewsScreen.css';

import PageTitle from '../components/PageTitle';

import TobeContinue from '../components/News/TobeContinue';
const NewsScreen = ({ currentUser }) => {
  return (
    <div>
      <div className="Dashboard">
        <div className="partnersMainPartContainer">
          <div className="partnersMainPart">
            <PageTitle title="소식/이벤트 관리" />
            <TobeContinue />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsScreen;
