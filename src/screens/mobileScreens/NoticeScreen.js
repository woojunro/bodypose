import React from 'react';
import Header from '../../components/mobileComponents/HeaderM';

const NoticeScreen = ({ match }) => {
  return (
    <div>
      <Header pageName="home" />
      {match.params.noticeNumber} 번째 공지사항
    </div>
  );
};

export default NoticeScreen;
