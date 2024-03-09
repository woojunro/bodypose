import { useMutation } from '@apollo/client';
import React from 'react';
import { DELETE_STUDIO_REVIEW_MUTATION } from '../../../gql/mutations/DeleteStudioReviewMutation';
import './RemoveModal.css';

const RemoveModal = ({
  currentReview,
  close,
  closeDetail,
  isOpen,
  refetchReviews,
  refetchStudio,
}) => {
  const [deleteReview] = useMutation(DELETE_STUDIO_REVIEW_MUTATION, {
    fetchPolicy: 'no-cache',
    onCompleted: () => {
      close();
      closeDetail();
      refetchStudio();
      refetchReviews();
    },
    onError: () => {
      close();
      closeDetail();
      refetchStudio();
      refetchReviews();
    },
  });

  const renderedReasons = () => {
    return (
      <div className="removeReviewContainer">
        <div className="removeTitle">정말 리뷰를 삭제하시겠습니까?</div>
        <span
          className="removeAnswer"
          onClick={() => {
            deleteReview({
              variables: {
                id: currentReview,
              },
            });
          }}
        >
          예
        </span>
        <span className="removeAnswer" onClick={close}>
          아니오
        </span>
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

        <div className="removeModal">
          <div
            className="removegreyBackground"
            onClick={() => {
              close(false);
            }}
          >
            <div className="removeTrueModal">
              <div
                className="removemodalContents"
                onClick={e => {
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

export default RemoveModal;
