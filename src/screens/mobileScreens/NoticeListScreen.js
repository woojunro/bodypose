import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { GetNotices } from '../../components/functions/WithDb/Notice';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import './NoticeListScreen.css';

const NoticeListScreen = () => {
  const history = useHistory();
  const fullNoticies = GetNotices();
  const [noticies, setNoticies] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const lastPageNumber = Math.ceil(fullNoticies.length / 8);

  useEffect(() => {
    setNoticies(fullNoticies.slice(0, 8 * pageNum));
  }, [pageNum]);

  const renderedNotices = noticies.map((notice) => {
    const toLink = '/notices/' + notice.noticeNumber;
    return (
      <Link
        to={toLink}
        key={toLink}
        style={{ decoder: 'none', color: 'white' }}
      >
        <div className="noticeCard">
          <div className="noticeCardTitle">{notice.title}</div>
          <div className="noticeDate">{notice.timestamp}</div>
        </div>
      </Link>
    );
  });

  const seeMoreButton = () => {
    if (pageNum === lastPageNumber) {
      return <div>모든 공지사항을 불러왔습니다.</div>;
    } else {
      return (
        <div
          className="showMoreNoticeButton"
          onClick={() => setPageNum(pageNum + 1)}
        >
          더보기
        </div>
      );
    }
  };

  return (
    <div>
      <div className="usersTopContainer">
        <FiArrowLeft
          className="usersGoBackArrow"
          onClick={() => {
            history.goBack();
          }}
        />
        <div className="leaveTitle">공지사항</div>
        <div className="usersTopEmptyBox" />
      </div>
      <div className="noticeList">{renderedNotices}</div>
      <div className="showMoreNotice">{seeMoreButton()}</div>
    </div>
  );
};

export default NoticeListScreen;
