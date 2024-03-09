import React, { useState } from 'react';
import './NoticeList.css';
import { useHistory } from 'react-router';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import { useQuery } from '@apollo/client';
import { GET_PARTNERS_NOTICES } from '../../../graphql/queries/partnersNotices';
import { LoggedInPaths } from '../../../routers/LoggedInRouter';
import moment from 'moment';

const NoticeList = () => {
  const history = useHistory();

  const [page, setPage] = useState(1);

  const { data } = useQuery(GET_PARTNERS_NOTICES, {
    variables: { page },
    fetchPolicy: 'network-only',
  });

  const previousPage = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };

  const nextPage = () => {
    const totalPages = data?.partnersNotices?.totalPages;
    if (!totalPages || page >= totalPages) return;
    setPage(page + 1);
  };

  return (
    <div className="fullNoticeBox">
      <div className="noticeContainer">
        <div className="noticeList">
          {(data?.partnersNotices?.partnersNotices || []).map(item => (
            <div
              key={item.id}
              className="NoticeLine"
              onClick={() =>
                history.push(
                  LoggedInPaths.NOTICE_DETAIL.replace(':noticeId', item.id)
                )
              }
            >
              <div className="NoticeItemTitle">{item.title}</div>
              <div className="dashboardNoticeItemDate">
                {moment(item.updatedAt).format('YYYY.MM.DD')}
              </div>
            </div>
          ))}
        </div>
        <div className="noticePageContainer">
          <IoIosArrowBack onClick={previousPage} className="noticePageArrow" />
          {page} / {data?.partnersNotices?.totalPages || 'Loading...'}
          <IoIosArrowForward onClick={nextPage} className="noticePageArrow" />
        </div>
      </div>
    </div>
  );
};

export default NoticeList;
