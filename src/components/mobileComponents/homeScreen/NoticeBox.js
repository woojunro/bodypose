import React from 'react';
import './NoticeBox.css';
import { Link } from 'react-router-dom';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const NoticeBox = ({ notices }) => {
  const Notices = notices;
  const renderedNotices = Notices.map((notice) => {
    return (
      <Link
        onClick={() => window.scrollTo(0, 0)}
        key={notice.title}
        target="_blank"
        to={'/notices/' + notice.id}
        style={{ textDecoration: 'none' }}
      >
        <div className="noticeItem">{notice.title}</div>
      </Link>
    );
  });

  return (
    <div className="noticeContainer">
      <div className="greyBox" />
      <Link
        to="/notices"
        style={{ textDecoration: 'none' }}
        onClick={() => window.scrollTo(0, 0)}
      >
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
