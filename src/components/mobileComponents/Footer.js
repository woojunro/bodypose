import React from 'react';
import { useHistory } from 'react-router-dom';
import { PRIVACY_NOTICE_ID, TEMRS_NOTICE_ID } from '../../constants/noticeIds';
import './Footer.css';

const Footer = () => {
  const history = useHistory();
  return (
    <div className="footer">
      <span
        onClick={() => {
          history.push(`/notices/${TEMRS_NOTICE_ID}`);
          window.scrollTo(0, 0);
        }}
        className="footerText"
      >
        이용약관
      </span>
      <span className="footerText">|</span>

      <span
        onClick={() => {
          history.push(`/notices/${PRIVACY_NOTICE_ID}`);
          window.scrollTo(0, 0);
        }}
        className="footerText"
      >
        개인정보처리방침
      </span>
      <span className="footerText">|</span>
      <a href="mailto:help@fmonth.com" className="footerMailToAnchor">
        <span className="footerText" style={{ color: 'black' }}>
          고객센터 help@fmonth.com
        </span>
      </a>
    </div>
  );
};

export default Footer;
