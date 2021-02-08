import React from 'react';
import { Link } from 'react-router-dom';
import { PRIVACY_NOTICE_ID, TEMRS_NOTICE_ID } from '../../constants/noticeIds';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <Link
        onClick={() => window.scrollTo(0, 0)}
        to={`/notices/${TEMRS_NOTICE_ID}`}
        style={{ TextDecoder: 'none', color: 'white' }}
      >
        <span className="footerText">이용약관</span>
      </Link>
      <span className="footerText">|</span>
      <Link
        onClick={() => window.scrollTo(0, 0)}
        to={`/notices/${PRIVACY_NOTICE_ID}`}
        style={{ TextDecoder: 'none', color: 'white' }}
      >
        <span className="footerText">개인정보취급방침</span>
      </Link>
      <span className="footerText">|</span>
      <span className="footerText" style={{ color: 'black' }}>
        고객센터 help@fmonth.com
      </span>
    </div>
  );
};

export default Footer;
