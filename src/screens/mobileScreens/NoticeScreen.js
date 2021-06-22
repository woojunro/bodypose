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
          <div className="noticeTitlePart">
            <div className="noticeType">공지</div>
            <div>|</div>
            <div className="fullNoticeTitle">{data.notice.notice.title}</div>
          </div>
          <div className="fullNoticeDate">
            {String(data.notice.notice.updatedAt).substr(0, 10)}
          </div>
          <div className="fullNoticeText">
            {data.notice.notice.content.split('\n').map((text, idx) => (
              <div key={`notice-${noticeId}-${idx}`}>
                {text.length === 0 ? (
                  ' '
                ) : text.startsWith('img::') ? (
                  <div>
                    <img
                      className="fullNoticeImg"
                      src={text.substring(5)}
                      alt="공지사항 이미지"
                    />
                  </div>
                ) : (
                  text
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeScreen;
