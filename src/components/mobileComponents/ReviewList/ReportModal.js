import React, { useState } from 'react';
import './ReportModal.css';
const ReportModal = ({ currentReview, close, isOpen }) => {
  const [reason, setReason] = useState('');
  const [reasonText, setReasonText] = useState('');

  //신고하는 함수.
  const submitReport = () => {
    if (reason === '' || (reason === '기타' && reasonText === '')) {
      return;
    } else {
      console.log(reason, reasonText);
    }
  };

  const renderedReasons = () => {
    return (
      <div className="reviewReaonsContainer">
        <div className="reportTitle">신고하기</div>
        <div
          className={
            reason === '초상권 침해' ? 'selectedReportReason' : 'reportReason'
          }
          onClick={() => {
            setReason('초상권 침해');
          }}
        >
          초상권 침해 및 무단도용
        </div>
        <div
          className={
            reason === '거짓 정보' ? 'selectedReportReason' : 'reportReason'
          }
          onClick={() => {
            setReason('거짓 정보');
          }}
        >
          거짓 정보
        </div>
        <div
          className={
            reason === '비방 또는 모욕'
              ? 'selectedReportReason'
              : 'reportReason'
          }
          onClick={() => {
            setReason('비방 또는 모욕');
          }}
        >
          비방 또는 모욕
        </div>
        <div
          className={
            reason === '리뷰와 무관한 사진 및 글'
              ? 'selectedReportReason'
              : 'reportReason'
          }
          onClick={() => {
            setReason('리뷰와 무관한 사진 및 글');
          }}
        >
          리뷰와 무관한 사진 및 글
        </div>
        <div
          className={
            reason === '기타' ? 'selectedReportReason' : 'reportReason'
          }
          onClick={() => {
            setReason('기타');
          }}
        >
          기타 (자세한 신고 사유 필수)
        </div>
        <form>
          <textarea
            className="reasonTextArea"
            value={reasonText}
            placeholder="자세한 신고 사유를 입력해주세요."
            onChange={(e) => {
              setReasonText(e.target.value);
            }}
          />
        </form>
        <div className="reportButtons">
          {reason === '' || (reason === '기타' && reasonText === '') ? (
            <div className="unactiveReportButton">신고하기</div>
          ) : (
            <div className="reportButton" onClick={() => submitReport()}>
              신고하기
            </div>
          )}
          <div
            className="reportButton"
            onClick={() => {
              setReason('');
              setReasonText('');
              close(false);
            }}
          >
            취소
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      {isOpen ? (
        ////만약 isopen(this.state.isModalOpen)이 true일때 코드를 실행 false면  null
        /// <div onClick={close}> 회색 바탕을 누를시 모달이 꺼지게 만듬
        ////<div className="modalContents" onClick={(e) => e.stopPropagation()}>
        /// 이 범위의 이벤트는 상위로 전이 막음.

        <div className="reportModal">
          <div
            className="reportgreyBackground"
            onClick={() => {
              close(false);
            }}
          >
            <div className="reportTrueModal">
              <div
                className="reportmodalContents"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {renderedReasons()}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ReportModal;
