import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { GetFullNotice } from '../../components/functions/WithDb/Notice';
import './NoticeScreen.css';

const NoticeScreen = ({ match }) => {
  const history = useHistory();
  const noticeNum = match.params.noticeNumber;
  const notice = GetFullNotice(noticeNum);
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
      <div className="noticeBodyPart">
        <div className="fullNoticeTitle">{notice.title}</div>
        <div className="fullNoticeDate">{notice.timestamp}</div>
        <div className="fullNoticeText">{notice.text}</div>
      </div>
    </div>
  );
};

export default NoticeScreen;
