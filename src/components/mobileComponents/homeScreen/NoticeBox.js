import React from 'react';
import './NoticeBox.css';
import { Link, useHistory } from 'react-router-dom';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const NoticeBox = ({ notices }) => {
  const history = useHistory();
  const Notices = notices;
  const renderedNotices = Notices.map((notice) => {
    return (
      <div
        onClick={() => {
          history.push('/notices/' + notice.id);
          window.scrollTo(0, 0);
        }}
        className="noticeItem"
      >
        {notice.title}
      </div>
    );
  });

  return (
    <div className="noticeContainer">
      <div className="greyBox" />
      <span
        className="noticeHeader"
        onClick={() => {
          history.push('/notices');
          window.scrollTo(0, 0);
        }}
      >
        공지사항
      </span>
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
