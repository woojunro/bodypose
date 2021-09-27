import React from 'react';
import logoAndsymbol from '../../materials/로고+심볼.png';
import './IEScreen.css';

const IEScreen = () => {
  const IEText =
    '인터넷 익스플로러는 보안에 취약하여 지원하지 않고 있습니다.\n크롬,사파리 등의 다른 브라우저로 접속하시기바랍니다.';

  const Header = () => {
    return (
      <div>
        <div className="header">
          <div className="headerLogo">
            <img src={logoAndsymbol} alt="BodyPose" />
          </div>
        </div>
        <div style={{ height: '50px' }} />
      </div>
    );
  };
  const renderedIEText = () => {
    return <div className="IEText">{IEText}</div>;
  };

  return (
    <div>
      {Header()}
      <div className="IETextContainer">{renderedIEText()}</div>
      <img
        className="noIEimg"
        src="https://storage.googleapis.com/bodypose-storage/hompage/no_ie_img.png"
        alt="logos"
      />
    </div>
  );
};

export default IEScreen;
