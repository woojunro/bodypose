import React, { Component } from 'react';
import { IoIosClose } from 'react-icons/io';
import { Link } from 'react-router-dom';
import './ConceptModal.css';

class Modal extends Component {
  render() {
    const {
      isOpen,
      close,
      concept,
      needFetchMoreData,
      photoNum,
      setThisPhoto,
      openModal,
      isFinalPhoto,
      handleIsFinalPhoto,
    } = this.props;
    return (
      <>
        {isOpen ? (
          <div className="modal">
            <div className="trueModal">
              <div className="topBarContainer">
                <div style={{ width: '45px' }}></div>
                <div className="studioTitle">{concept.title}</div>
                <IoIosClose
                  onClick={() => {
                    close();
                    handleIsFinalPhoto();
                  }}
                />
              </div>
              <div className="conceptModalContents">
                <div className="mainPhotoArea">
                  <img alt="studioPicture" src={concept.pic} />
                  {!isFinalPhoto ? (
                    <div
                      className="nextButton"
                      onClick={() => {
                        setThisPhoto(photoNum + 1);
                        needFetchMoreData(photoNum + 1);
                        close();
                        openModal();
                      }}
                    >
                      다음사진
                    </div>
                  ) : null}
                  {photoNum - 1 >= 0 ? (
                    <div
                      className="prevButton"
                      onClick={() => {
                        handleIsFinalPhoto();
                        setThisPhoto(photoNum - 1);
                        close();
                        openModal();
                      }}
                    >
                      이전사진
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="toStudioInfoContainer">
                <Link
                  to={`/studios/${concept.studio}`}
                  className="toStudioInfo"
                >
                  <div>스튜디오 정보 보기</div>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

export default Modal;
