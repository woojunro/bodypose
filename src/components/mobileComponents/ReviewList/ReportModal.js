import React from 'react';
import './ReportModal.css';
import { ReportReview } from '../../functions/WithDb/Review';
const ReportModal = ({ currentReview, close, isOpen }) => {
  const renderedReasons = () => {
    return (
      <div className="renderedReaonsContainer">
        <div className="reportTitle">신고하기</div>
        <div
          className="reportReason"
          onClick={() => {
            ReportReview(currentReview, '초상권 침해');
          }}
        >
          초상권 침해 및 무단도용
        </div>
        <div
          className="reportReason"
          onClick={() => {
            ReportReview(currentReview, '거짓 정보');
          }}
        >
          거짓 정보
        </div>
        <div
          className="reportReason"
          onClick={() => {
            ReportReview(currentReview, '비방 또는 모욕');
          }}
        >
          비방 또는 모욕
        </div>
        <div
          className="reportReason"
          onClick={() => {
            ReportReview(currentReview, '리뷰와 무관한 사진 및 글');
          }}
        >
          리뷰와 무관한 사진 및 글
        </div>
        <div
          className="reportReason"
          onClick={() => {
            ReportReview(currentReview, '기타');
          }}
        >
          기타
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
