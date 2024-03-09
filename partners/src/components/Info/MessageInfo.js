import React from 'react';
import './MessageInfo.css';

const MessageInfo = ({
  smsRecieve = false,
  setSmsRecieve = () => {},
  emailRecieve = false,
  setEmailRecieve = () => {},
}) => {
  return (
    <div className="fullSizeBox">
      <div className="boxTitle">정보 수신 설정</div>
      <div className="messageInfoContainer">
        <div className="SMSContainer">
          <div className="messageTitle">SMS 수신여부</div>
          <div className="measageData">
            <div>이벤트, 공지사항 등에 대한 정보를 SMS로 받아보시겠습니까?</div>
            <div className="messageButtons">
              <label>
                <input
                  type="radio"
                  checked={smsRecieve}
                  onChange={() => {
                    setSmsRecieve(true);
                  }}
                />
                예
              </label>
              <label>
                <input
                  type="radio"
                  checked={!smsRecieve}
                  onChange={() => {
                    setSmsRecieve(false);
                  }}
                />
                아니오
              </label>
            </div>
            <div className="messageDiscription">
              SMS 수신거부와 상관 없이 주요 공지 관련 메세지는 발송됩니다.
            </div>
          </div>
        </div>
        <div className="emailContainer">
          <div className="messageTitle">이메일 수신여부</div>
          <div className="measageData">
            <div>
              이벤트, 공지사항 등에 대한 정보를 이메일로 받아보시겠습니까?
            </div>
            <div className="messageButtons">
              <label>
                <input
                  type="radio"
                  checked={emailRecieve}
                  onChange={() => {
                    setEmailRecieve(true);
                  }}
                />
                예
              </label>
              <label>
                <input
                  type="radio"
                  checked={!emailRecieve}
                  onChange={() => {
                    setEmailRecieve(false);
                  }}
                />
                아니오
              </label>
            </div>
            <div className="messageDiscription">
              이메일 수신거부와 상관 없이 주요 공지 관련 메세지는 발송됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInfo;
