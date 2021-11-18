import React from 'react';
import { useHistory } from 'react-router-dom';
import { PRIVACY_NOTICE_ID, TEMRS_NOTICE_ID } from '../../constants/noticeIds';
import './Footer.css';

const Footer = () => {
  const openInNewTab = url => {
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
      <div className="footerInfo">
        <div className="footerLeftContainer">
          <img
            src="https://storage.googleapis.com/bodypose-storage/hompage/fmonth_logo.png"
            alt="logo"
            className="footerLogo"
            onClick={() => openInNewTab('http://fmonth.com')}
          />
          <div>에프먼스</div>
          <div>대표 : 김재승</div>
          <div>사업자등록번호 : 405-25-01435</div>
          <div className="contacts">
            <div className="contactText">Contact :</div>
            <div
              className="footerContactLink"
              onClick={() => {
                window.open('https://pf.kakao.com/_xbxoHEs', '_blank').focus();
              }}
            >
              카카오채널
            </div>
            <div className="contactDivider">|</div>
            <div
              className="footerContactLink"
              onClick={() => {
                window.open('mailTo:help@fmonth.com').focus();
              }}
            >
              help@fmonth.com
            </div>
            <div className="contactDivider">|</div>
            <div>010-6464-6301</div>
          </div>
        </div>
        <div className="footerRightContainer">
          <div>MON ~ FRI</div>
          <div>09:30 ~ 19:00</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
