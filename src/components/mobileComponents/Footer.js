import React from 'react';
import { useHistory } from 'react-router-dom';
import { PRIVACY_NOTICE_ID, TEMRS_NOTICE_ID } from '../../constants/noticeIds';
import './Footer.css';

const Footer = () => {
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };
  const history = useHistory();
  return (
    <div className="footer">
      <div className="footerFirstLine">
        <div
          onClick={() => {
            history.push(`/notices/${TEMRS_NOTICE_ID}`);
            window.scrollTo(0, 0);
          }}
          className="footerText"
        >
          이용약관
        </div>
        <div className="footerText">|</div>

        <div
          onClick={() => {
            history.push(`/notices/${PRIVACY_NOTICE_ID}`);
            window.scrollTo(0, 0);
          }}
          className="footerText"
        >
          개인정보처리방침
        </div>
        <div className="footerText">|</div>
        <div
          className="footerText"
          onClick={() => openInNewTab('https://pf.kakao.com/_xbxoHEs')}
        >
          고객센터
        </div>
        <div className="footerText">|</div>

        <div
          className="footerText"
          onClick={() => openInNewTab('https://pf.kakao.com/_xbxoHEs')}
        >
          입점문의
        </div>
      </div>
      <div
        className="footerText"
        style={{ marginTop: '5px' }}
        onClick={() => openInNewTab('mailTo:help@fmonth.com')}
      >
        메일문의 help@fmonth.com
      </div>
    </div>
  );
};

export default Footer;
