import React from 'react';
import './NoticeScreen.css';
import PageTitle from '../components/PageTitle';
import NoticeList from '../components/Dashboard/Notice/NoticeList';
import Footer from '../components/Footer';

const NoticeScreen = () => {
  return (
    <div className="Dashboard">
      <div className="partnersMainPartContainer">
        <div className="partnersMainPart">
          <PageTitle title="공지사항" />
          <NoticeList />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default NoticeScreen;
