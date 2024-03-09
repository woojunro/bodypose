import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { REPORT_STUDIO_REVIEW_MUTATION } from '../../../gql/mutations/ReportStudioReviewMutation';
import './ReportModal.css';

const REPORT_REASON_OPTIONS = [
  { front: '초상권 침해 및 무단 도용', back: 'IDENTITY_THEFT' },
  { front: '거짓 정보', back: 'FAKE_CONTENT' },
  { front: '비방 또는 모욕', back: 'LIBEL_INSULT' },
  { front: '리뷰와 무관한 사진 및 글', back: 'UNRELATED_CONTENT' },
  { front: '기타 (자세한 신고 사유 필수)', back: 'THE_OTHERS' },
];

const ReportModal = ({ currentReview, close, isOpen }) => {
  const [reasonIndex, setReasonIndex] = useState(-1);
  const [reasonText, setReasonText] = useState('');
  const [reportStatus, setReportStatus] = useState('');

  const [reportStudioReview] = useMutation(REPORT_STUDIO_REVIEW_MUTATION, {
    onCompleted: data => {
      if (data.reportStudioReview.ok) {
        renderMessageAndClose(
          '신고가 접수되었습니다.\n이용해주셔서 감사합니다.'
        );
      } else {
        if (data.reportStudioReview.error === 'ALREADY_REPORTED') {
          renderMessageAndClose(
            '신고가 접수되었습니다.\n이용해주셔서 감사합니다.'
          );
        } else {
          setReportStatus('오류가 발생하였습니다.\n다시 시도해주세요.');
          setTimeout(() => setReportStatus(''), 3000);
        }
      }
    },
    onError: () => {
      setReportStatus('오류가 발생하였습니다.\n다시 시도해주세요.');
      setTimeout(() => setReportStatus(''), 3000);
    },
  });

  const renderMessageAndClose = message => {
    setReportStatus(message);
    setTimeout(() => {
      setReportStatus('');
      setReasonIndex(-1);
      setReasonText('');
      close();
    }, 3000);
  };

  //신고하는 함수.
  const submitReport = () => {
    if (reasonIndex === -1 || (reasonIndex === 4 && reasonText === '')) {
      return;
    } else {
      setReportStatus('잠시만 기다려주세요...');
      reportStudioReview({
        variables: {
          studioReviewId: currentReview,
          reason: REPORT_REASON_OPTIONS[reasonIndex].back,
          detail: reasonText,
        },
      });
    }
  };

  const renderedReasons = () => {
    return (
      <div className="reviewReaonsContainer">
        <div className="reportTitle">신고하기</div>
        {REPORT_REASON_OPTIONS.map((reason, idx) => (
          <div
            key={`ReportReason-${reason.back}`}
            className={
              reasonIndex === idx ? 'selectedReportReason' : 'reportReason'
            }
            onClick={() => setReasonIndex(idx)}
          >
            {reason.front}
          </div>
        ))}
        <form>
          <textarea
            className="reasonTextArea"
            value={reasonText}
            placeholder="자세한 신고 사유를 입력해주세요."
            onChange={e => {
              setReasonText(e.target.value);
            }}
          />
        </form>
        <div className="reportButtons">
          {reasonIndex === -1 || (reasonIndex === 4 && reasonText === '') ? (
            <div className="unactiveReportButton">신고하기</div>
          ) : (
            <div className="reportButton" onClick={() => submitReport()}>
              신고하기
            </div>
          )}
          <div
            className="reportButton"
            onClick={() => {
              setReasonIndex(-1);
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
              {reportStatus.length > 0 ? (
                <div className="reportTrueModalFullDiv">{reportStatus}</div>
              ) : (
                <div
                  className="reportmodalContents"
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  {renderedReasons()}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ReportModal;
