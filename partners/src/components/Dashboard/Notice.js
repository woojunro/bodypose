import React from 'react';
import './Notice.css';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PARTNERS_NOTICES } from '../../graphql/queries/partnersNotices';
import DashboardLoading from './DashboardLoading';
import { LoggedInPaths } from '../../routers/LoggedInRouter';
import moment from 'moment';

const Notice = () => {
  const history = useHistory();

  const { data, loading } = useQuery(GET_PARTNERS_NOTICES, {
    variables: { page: 1 },
    fetchPolicy: 'network-only',
  });

  return (
    <div className="dashboardNoticeContainer">
      <div className="boxTitle">
        <div>공지사항</div>
        <div
          className="gotoPage"
          onClick={() => history.push(LoggedInPaths.NOTICE)}
        >
          공지사항 보기
        </div>
      </div>
      {loading ? (
        <DashboardLoading />
      ) : (
        <div className="dashboardNoticeItemContainer">
          {(data?.partnersNotices?.partnersNotices || []).map(item => (
            <div
              key={item.id}
              className="dashboardNoticeLine"
              onClick={() =>
                history.push(
                  LoggedInPaths.NOTICE_DETAIL.replace(':noticeId', item.id)
                )
              }
            >
              <div className="dashboardNoticeItemTitle">{item.title}</div>
              <div className="dashboardNoticeItemDate">
                {moment(item.updatedAt).format('YYYY.MM.DD')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notice;
