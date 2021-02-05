import React, { useState, useContext, useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import { Link, useHistory } from 'react-router-dom';
import './ConceptModal.css';
import { ChangeIsHearted } from '../../../components/functions/WithDb/ChangeIsHearted';
import { GetPhotoInfo } from '../../../components/functions/WithDb/ConceptList';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import LoadingIcon from './LoadingIcon';
import LoginContext from '../../../contexts/LoginContext';

const Modal = ({
  whileFetching,
  isOpen,
  close,
  concept,
  needFetchMoreData,
  photoNum,
  setThisPhoto,
  openModal,
  isFinalPhoto,
  handleIsFinalPhoto,
}) => {
  const LoggedIn = useContext(LoginContext);
  const [gettingPhotoInfo, setGettingPhotoInfo] = useState(true);
  const [isHearted, setIsHearted] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    GetPhotoInfo(concept, setGettingPhotoInfo, setIsHearted, setPhoto);
  }, [concept]);

  const history = useHistory();
  const ChangeHeart = () => {
    ChangeIsHearted();
    //Db에도 isHearted 바꿔주기
    setIsHearted(!isHearted);
  };
  var RenderedHeart;
  if (isHearted) {
    RenderedHeart = (
      <div
        onClick={() => {
          ChangeHeart();
        }}
      >
        <FaHeart className="conceptFilledHeart" />
      </div>
    );
  } else {
    if (LoggedIn.loggedIn) {
      RenderedHeart = (
        <div
          onClick={() => {
            ChangeHeart();
          }}
        >
          <FaRegHeart className="conceptRegHeart" />
        </div>
      );
    } else {
      RenderedHeart = (
        <div>
          <FaRegHeart
            className="conceptRegHeart"
            onClick={() => {
              history.push({
                pathname: '/login',
                state: { previousPath: history.location.pathname },
              });
            }}
          />
        </div>
      );
    }
  }
  return (
    <>
      {isOpen ? (
        <div>
          <div className="conceptmodal">
            <div className="concepttrueModal">
              {gettingPhotoInfo ? (
                <div className="gettingHeart">
                  <LoadingIcon />
                </div>
              ) : (
                <>
                  {whileFetching ? null : (
                    <>
                      {!isFinalPhoto ? (
                        <div className="nextArrowContainer">
                          <IoIosArrowForward
                            className="nextButton"
                            onClick={() => {
                              setThisPhoto(photoNum + 1);
                              needFetchMoreData(photoNum + 1);

                              close();
                              openModal();
                              setGettingPhotoInfo(true);
                            }}
                          />
                        </div>
                      ) : null}
                      {photoNum - 1 >= 0 ? (
                        <div className="prevArrowContainer">
                          <IoIosArrowBack
                            className="prevButton"
                            onClick={() => {
                              handleIsFinalPhoto();
                              setThisPhoto(photoNum - 1);
                              close();
                              openModal();
                              setGettingPhotoInfo(true);
                            }}
                          />
                        </div>
                      ) : null}
                    </>
                  )}

                  <div className="topBarContainer">
                    <div style={{ width: '45px' }}></div>
                    <div className="studioTitle">{concept.title}</div>
                    <IoIosClose
                      className="conceptModalClose"
                      onClick={() => {
                        close();
                        handleIsFinalPhoto();
                      }}
                    />
                  </div>
                  <div className="conceptModalContents">
                    <div className="mainPhotoArea">
                      {whileFetching ? (
                        <div className="whileLoading">
                          <LoadingIcon />
                        </div>
                      ) : (
                        <img alt="studioPicture" src={photo} />
                      )}
                    </div>
                  </div>
                  <div className="toStudioInfoContainer">
                    {history.location.pathname ===
                    `/studios/${concept.studio}` ? (
                      <div
                        className="toStudioInfo"
                        onClick={() => window.location.reload()}
                      >
                        <div>스튜디오 정보 보기</div>
                      </div>
                    ) : (
                      <Link
                        to={{
                          pathname: `/studios/${concept.studio}`,
                          state: { previousPath: history.location.pathname },
                        }}
                        className="toStudioInfo"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <div>스튜디오 정보 보기</div>
                      </Link>
                    )}

                    {RenderedHeart}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
