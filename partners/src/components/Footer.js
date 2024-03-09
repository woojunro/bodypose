import React from 'react';
import './Footer.css';
import logo from '../materials/로고+심볼.png';
import { openBodyposeContact } from './function/openInNewTab';
import { NOTICE_URL, PRIVACY_URL } from '../constants/urls';

const Footer = () => {
  //이용약관, 개인정보취급방칭 여는 함수
  const openNotice = url => {
    window.open(url, '_blank');
  };

  return (
    <div className="footerContainer">
      <div className="footerLinkLine">
        <div className="footerLink" onClick={() => openNotice(NOTICE_URL)}>
          이용약관
        </div>
        <div className="footerLink" onClick={() => openNotice(PRIVACY_URL)}>
          개인정보취급방침
        </div>
        <div className="footerLink" onClick={openBodyposeContact}>
          Contact Us
        </div>
      </div>
      <div className="footerMainContainer">
        <div className="footerMain">
          <img src={logo} alt="logo" />
          <div className="footerAboutCompany">
            <div>
              <div>에프먼스</div>
              <div>대표 : 김재승</div>
              <div>사업자등록번호 : 405-25-01435</div>
            </div>

            <div className="companyContact">
              <div
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={openBodyposeContact}
              >
                카카오톡 고객센터 연결하기
              </div>
              <div>help@fmonth.com</div>
              <div>고객센터 연락처 : 010-6464-6301</div>
              <div>MON-FRI 09:30 ~ 19:30</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
