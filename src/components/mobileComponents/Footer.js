import React from 'react';
import { Link } from 'react-router-dom';
import DbNotices from '../../virtualDB/items/DbNotices';
import './Footer.css';

const Footer = () => {
  var termsOfServices, privacy;
  DbNotices.map((notice) => {
    if (notice.title === '개인정보취급방침') {
      termsOfServices = notice;
    } else if (notice.title === '바디포즈 이용약관') {
      privacy = notice;
    }
    return null;
  });
  return (
    <div className="footer">
      <Link
        to={`/notices/${termsOfServices.noticeNumber}`}
        style={{ TextDecoder: 'none', color: 'white' }}
      >
        <span className="footerText">이용약관</span>
      </Link>
      <span className="footerText">|</span>
      <Link
        to={`/notices/${privacy.noticeNumber}`}
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
