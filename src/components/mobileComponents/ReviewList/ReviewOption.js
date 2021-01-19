import React from 'react';
import './ReviewOption.css';
import { IoIosClose } from 'react-icons/io';

const ReviewOption = ({
  isSameUser,
  setIsOptionOpen,
  setIsReportOpen,
  setIsRemoveOpen,
}) => {
  const renderedOption = () => {
    if (isSameUser) {
      return (
        <>
          <div className="reviewOption">수정하기</div>
          <div className="reviewOption" onClick={() => setIsRemoveOpen(true)}>
            삭제하기
          </div>
        </>
      );
    } else {
      return (
        <>
          <div
            className="reviewOption"
            onClick={() => {
              setIsReportOpen(true);
            }}
          >
            신고하기
          </div>
        </>
      );
    }
  };
  return (
    <>
      {isSameUser ? (
        <div className="sameUserReveiwOptionBox">
          <div className="sameUserReviwOption">{renderedOption()} </div>

          <IoIosClose
            onClick={() => setIsOptionOpen(false)}
            className="reviewOptionClose"
            style={{ paddingRight: '2px' }}
          />
        </div>
      ) : (
        <div className="reveiwOptionBox">
          {renderedOption()}
          <IoIosClose
            onClick={() => setIsOptionOpen(false)}
            className="reviewOptionClose"
            style={{ paddingRight: '2px' }}
          />
        </div>
      )}
    </>
  );
};

export default ReviewOption;
