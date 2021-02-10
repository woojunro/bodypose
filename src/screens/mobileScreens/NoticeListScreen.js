import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import LoadingComponent from '../../components/mobileComponents/LoadingComponent';
import { NOTICES_QUERY } from '../../gql/queries/NoticeQuery';

import './NoticeListScreen.css';

const NoticeListScreen = () => {
  const history = useHistory();
  const [page, setPage] = useState(1);

  const { data, loading, fetchMore } = useQuery(NOTICES_QUERY, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: { page: 1 },
    onError: () => alert('오류가 발생하였습니다. 다시 시도해주세요.'),
  });

  const fetchMoreNotices = () => {
    fetchMore({
      variables: {
        page: page + 1,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          ...prev,
          notices: {
            ...prev.notices,
            notices: [
              ...prev.notices.notices,
              ...fetchMoreResult.notices.notices,
            ],
          },
        });
      },
    });
    setPage(page + 1);
  };

  const seeMoreButton = () => {
    if (page === data.notices?.totalPages) {
      return (
        <div className="noticeListScreenNoMoreDiv">
          모든 공지사항을 불러왔습니다.
        </div>
      );
    } else {
      return (
        <div className="showMoreNoticeButton" onClick={fetchMoreNotices}>
          더보기
        </div>
      );
    }
  };

  return (
    <div>
      <div className="noticeListTopContainer">
        <FiArrowLeft
          className="usersGoBackArrow"
          onClick={() => {
            history.goBack();
          }}
        />
        <div className="leaveTitle">공지사항</div>
        <div className="usersTopEmptyBox" />
      </div>
      <div className="noticeList">
        {data?.notices &&
          data.notices.notices.map(notice => (
            <Link
              to={`/notices/${notice.id}`}
              key={notice.id}
              style={{ decoder: 'none', color: 'white' }}
            >
              <div className="noticeCard">
                <div className="noticeCardTitle">{notice.title}</div>
                <div className="noticeDate">
                  {String(notice.updatedAt).substr(0, 10)}
                </div>
              </div>
            </Link>
          ))}
      </div>
      {loading ? (
        <div className="showMoreNotice">
          <LoadingComponent />
        </div>
      ) : (
        <div className="showMoreNotice">{seeMoreButton()}</div>
      )}
    </div>
  );
};

export default NoticeListScreen;
