import React from 'react';
import logoAndsymbol from '../../materials/로고+심볼.png';
import './IEScreen.css';
import noIE from '../../materials/noie.jpeg';
import chromeLogo from '../../materials/chrome.jpg';
import correctionArrow from '../../materials/correctionArrow.png';
import safari from '../../materials/safari.png';
import edge from '../../materials/edge.jpg';
import opera from '../../materials/opera.png';

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
  const renderedIcons = () => {
    return (
      <div className="browserIcons">
        <img alt="no Internet Explorer" src={noIE} />
        <img alt="change to" src={correctionArrow} />
        <img alt="chrome" src={chromeLogo} />
        <img alt="safari" src={safari} />
        <img alt="edge" src={edge} /> <img alt="opera" src={opera} />
      </div>
    );
  };
  return (
    <div>
      {Header()}
      <div className="IETextContainer">{renderedIEText()}</div>
      {renderedIcons()}
    </div>
  );
};

export default IEScreen;
