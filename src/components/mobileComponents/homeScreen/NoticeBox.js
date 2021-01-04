import React from 'react';
import './NoticeBox.css';
import { Link } from 'react-router-dom';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import DbNotices from '../../../virtualDB/items/DbNotices';

const NoticeBox = () => {
  const Notices = DbNotices;
  const renderedNotices = Notices.map((notice) => {
    return (
      <Link
        key={notice.title}
        to={'/notices/' + notice.noticeNumber}
        style={{ TextDecoder: 'none', color: 'white' }}
      >
        <div className="noticeItem">{notice.title}</div>
      </Link>
    );
  });

  return (
    <div className="noticeContainer">
      <div className="greyBox" />
      <Link to="/notices" style={{ TextDecoder: 'none', color: 'white' }}>
        <span className="noticeHeader"> 공지사항 </span>
      </Link>
      <Carousel
        className="noticeTitles"
        axis="vertical"
        showIndicators={false}
        showStatus={false}
        showArrows={false}
        autoPlay={true}
        interval={3000}
        infiniteLoop={true}
        stopOnHover={true}
        showThumbs={false}
      >
        {renderedNotices}
      </Carousel>
    </div>
  );
};

export default NoticeBox;
