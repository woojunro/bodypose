import React, { useState, useContext, useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import { Link, useHistory } from 'react-router-dom';
import './ConceptModal.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import LoadingIcon from './LoadingIcon';
import LoginContext from '../../../contexts/LoginContext';
import { gql, useMutation } from '@apollo/client';
import {
  DISHEART_STUDIO_PHOTO_MUTATION,
  HEART_STUDIO_PHOTO_MUTATION,
} from '../../../gql/mutations/HeartStudioPhotoMutation';
import { client } from '../../../apollo';

const Modal = ({
  close,
  open,
  id,
  whileFetching,
  setThisPhoto,
  isFinalPhoto,
  selectedPhotoNum,
}) => {
  const concept = client.readFragment({
    id: `StudioPhotoWithIsHearted:${id}`,
    fragment: gql`
      fragment Concept on StudioPhotoWithIsHearted {
        id
        originalUrl
        isHearted
        studio {
          name
          slug
        }
      }
    `,
  });

  const LoggedIn = useContext(LoginContext);
  const [isHearted, setIsHearted] = useState(concept.isHearted);

  const history = useHistory();

  useEffect(() => {
    setIsHearted(concept.isHearted);
  }, [concept]);

  const changeIsHearted = () => {
    client.cache.modify({
      id: client.cache.identify(concept),
      fields: {
        isHearted(cachedIsHearted) {
          return !cachedIsHearted;
        },
      },
    });
  };

  const [heartStudioPhoto] = useMutation(HEART_STUDIO_PHOTO_MUTATION, {
    onError: () => alert('오류가 발생하였습니다. 다시 시도해주세요.'),
    onCompleted: data => {
      if (data.heartStudioPhoto.ok) {
        changeIsHearted();
      }
    },
  });

  const [disheartStudioPhoto] = useMutation(DISHEART_STUDIO_PHOTO_MUTATION, {
    onError: () => alert('오류가 발생하였습니다. 다시 시도해주세요.'),
    onCompleted: data => {
      if (data.disheartStudioPhoto.ok) {
        changeIsHearted();
      }
    },
  });

  const ChangeHeart = () => {
    if (isHearted) {
      disheartStudioPhoto({
        variables: {
          id: Number(concept.id),
        },
      });
    } else {
      heartStudioPhoto({
        variables: {
          id: Number(concept.id),
        },
      });
    }
    setIsHearted(!isHearted);
  };

  let RenderedHeart;
  if (isHearted) {
    RenderedHeart = (
      <div onClick={ChangeHeart}>
        <FaHeart className="conceptFilledHeart" />
      </div>
    );
  } else {
    if (LoggedIn.loggedIn) {
      RenderedHeart = (
        <div onClick={ChangeHeart}>
          <FaRegHeart className="conceptRegHeart" />
        </div>
      );
    } else {
      RenderedHeart = (
        <div>
          <FaRegHeart
            className="conceptRegHeart"
            onClick={() => {
              const ok = window.confirm(
                '로그인이 필요한 기능입니다. 로그인 하시겠습니까?'
              );
              if (!ok) {
                return;
              }

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
      <div>
        <div className="conceptmodal">
          <div className="concepttrueModal">
            {!isFinalPhoto ? (
              <div className="nextArrowContainer">
                <IoIosArrowForward
                  className="nextButton"
                  onClick={() => {
                    setThisPhoto(selectedPhotoNum + 1);
                  }}
                />
              </div>
            ) : null}
            {selectedPhotoNum > 0 ? (
              <div className="prevArrowContainer">
                <IoIosArrowBack
                  className="prevButton"
                  onClick={() => {
                    setThisPhoto(selectedPhotoNum - 1);
                  }}
                />
              </div>
            ) : null}
            <div className="topBarContainer">
              <div style={{ width: '45px' }}></div>
              <div className="studioTitle">{concept.studio.name}</div>
              <IoIosClose
                className="conceptModalClose"
                onClick={() => {
                  close();
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
                  <img alt="studioPicture" src={concept.originalUrl} />
                )}
              </div>
            </div>
            <div className="toStudioInfoContainer">
              {history.location.pathname ===
              `/studios/${concept.studio.slug}` ? (
                <div className="toStudioInfo" onClick={() => close()}>
                  <div>스튜디오 정보 보기</div>
                </div>
              ) : (
                <Link
                  to={{
                    pathname: `/studios/${concept.studio.slug}`,
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
