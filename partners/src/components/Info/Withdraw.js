import React, { useState } from 'react';
import './Withdraw.css';

const Withdraw = ({ setWithdraw }) => {
  //기본 사항 불러오기. (현재 이용해지 신청했으면 true, 아니라면 false)
  const [current, setCurrent] = useState(false);
  return (
    <div className="fullSizeBox">
      <div className="boxTitle">이용해지</div>
      <div className="withdrawContainer">
        <div className="withdrawTitle">이용해지</div>
        <div className="withdrawButton">이용해지하기</div>
      </div>
    </div>
  );
};

export default Withdraw;
