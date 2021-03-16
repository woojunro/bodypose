import { useQuery } from '@apollo/client';
import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import AppLoadingScreen from '../../components/mobileComponents/AppLoadingScreen';
import { NOTICE_QUERY } from '../../gql/queries/NoticeQuery';
import './NoticeScreen.css';
import ReactGA from 'react-ga';

const NoticeScreen = () => {
  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);
  const { noticeId } = useParams();
  const history = useHistory();
  const { data, loading, error } = useQuery(NOTICE_QUERY, {
    variables: {
      id: Number(noticeId),
    },
  });

  return (
    <div>
      <div className="usersTopContainer">
        <FiArrowLeft
          className="usersGoBackArrow"
          onClick={() => {
            history.goBack();
          }}
        />
      </div>
      {loading ? (
        <div className="appLoader">
          <AppLoadingScreen />
        </div>
      ) : error || !data.notice.ok ? (
        <Redirect to="/error" />
      ) : (
        <div className="noticeBodyPart">
          <div className="fullNoticeTitle">{data.notice.notice.title}</div>
          <div className="fullNoticeDate">
            {String(data.notice.notice.updatedAt).substr(0, 10)}
          </div>
          <div className="fullNoticeText">{data.notice.notice.content}</div>
        </div>
      )}
    </div>
  );
};

export default NoticeScreen;
