import React, { useState, useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import './ConceptModal.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import Swipe from 'react-easy-swipe';

import LoadingIcon from './LoadingIcon';
import { gql, useMutation, useReactiveVar } from '@apollo/client';
import {
  DISHEART_STUDIO_PHOTO_MUTATION,
  HEART_STUDIO_PHOTO_MUTATION,
} from '../../../gql/mutations/HeartStudioPhotoMutation';
import { client, IsLoggedInVar } from '../../../apollo';
import $ from 'jquery';
import { EXPOSE_ORIGINAL_STUDIO_PHOTO_MUTATION } from '../../../gql/mutations/LogMutation';

const Modal = ({
  close,
  id,
  whileFetching,
  setThisPhoto,
  isFinalPhoto,
  selectedPhotoNum,
  isForHeart = false,
  studioPhoto = null,
  studioSlug = null,
  studioName = null,
}) => {
  const concept = studioPhoto
    ? studioPhoto
    : client.readFragment({
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

  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const [isHearted, setIsHearted] = useState(concept.isHearted);

  const [disheartLoading, setDisHeartLoading] = useState(false);
  const history = useHistory();

  const [exposeOriginalStudioPhoto] = useMutation(
    EXPOSE_ORIGINAL_STUDIO_PHOTO_MUTATION
  );

  useEffect(() => {
    exposeOriginalStudioPhoto({
      variables: {
        input: {
          studioPhotoId: id,
        },
      },
    });
  }, [id, exposeOriginalStudioPhoto]);

  //뒤로가기 기능.
  window.addEventListener('popstate', function (e) {
    close();
  });
  //사파리 뒤로가기 기능.
  $(window).on('load', function () {
    function fire_popstate() {
      $(this).trigger('popstate'); // fire it when the page first loads
    }
    var lasthash = window.location.hash;
    setInterval(function () {
      var currenthash = window.location.hash;
      if (lasthash !== currenthash) {
        fire_popstate();
      }
    }, 500); //check every half second if the url has changed
  });

  useEffect(() => {
    setIsHearted(concept.isHearted);
  }, [concept]);

  const changeIsHearted = (id, heart) => {
    client.writeFragment({
      id: `StudioPhotoWithIsHearted:${id}`,
      fragment: gql`
        fragment StudioPhoto on StudioPhotoWithIsHearted {
          isHearted
        }
      `,
      data: {
        isHearted: heart,
      },
    });
  };

  const [heartStudioPhoto] = useMutation(HEART_STUDIO_PHOTO_MUTATION, {
    onError: () => {},
    onCompleted: data => {
      if (data.heartStudioPhoto.ok) {
        changeIsHearted(data.heartStudioPhoto.id, true);
      }
    },
  });

  const [disheartStudioPhoto] = useMutation(DISHEART_STUDIO_PHOTO_MUTATION, {
    onError: () => close(),
    onCompleted: data => {
      if (data.disheartStudioPhoto.ok) {
        changeIsHearted(data.disheartStudioPhoto.id, false);
        if (isForHeart) {
          close();
        }
      }
    },
  });

  //오른쪽으로 스와이프 했을 때, 이전 사진 부르기
  const onSwipeRight = () => {
    if (selectedPhotoNum > 0) {
      setThisPhoto(selectedPhotoNum - 1);
    }
  };

  //왼쪽으로 스와이프 했을 때, 이후 사진 부르기
  const onSwipeLeft = () => {
    if (!isFinalPhoto) {
      setThisPhoto(selectedPhotoNum + 1);
    }
  };

  const ChangeHeart = () => {
    if (isHearted) {
      disheartStudioPhoto({
        variables: {
          id,
        },
      });
      if (isForHeart) {
        setDisHeartLoading(true);
      }
    } else {
      heartStudioPhoto({
        variables: {
          id,
        },
      });
    }
    setIsHearted(!isHearted);
  };

  let RenderedHeart;
  if (isHearted) {
    RenderedHeart = (
      <div onClick={ChangeHeart}>
        <IoHeart className="conceptFilledHeart" />
      </div>
    );
  } else {
    if (isLoggedIn) {
      RenderedHeart = (
        <div onClick={ChangeHeart}>
          <IoHeartOutline className="conceptRegHeart" />
        </div>
      );
    } else {
      RenderedHeart = (
        <div>
          <IoHeartOutline
            className="conceptRegHeart"
            onClick={() => {
              const ok = window.confirm(
                '로그인이 필요한 기능입니다. 로그인 하시겠습니까?'
              );
              if (!ok) return;
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
      {disheartLoading ? (
        <div className="conceptmodal">
          <div className="appFullScreenCenter">
            <LoadingIcon />
          </div>
        </div>
      ) : (
        <div>
          <div className="conceptmodal">
            <div className="concepttrueModal">
              <div className="topBarContainer">
                <div className="studioTitle">
                  {studioName ? studioName : concept.studio.name}
                </div>
              </div>
              <IoIosClose
                className="conceptModalClose"
                onClick={() => {
                  close();
                  history.goBack();
                }}
              />
              <div className="conceptModalContents">
                {whileFetching ? (
                  <div className="mainPhotoArea">
                    <div className="whileLoading">
                      <LoadingIcon />
                    </div>
                  </div>
                ) : (
                  <Swipe
                    className="mainPhotoArea"
                    onSwipeRight={() => onSwipeRight()}
                    onSwipeLeft={() => onSwipeLeft()}
                  >
                    <div>
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
                    </div>
                    <img
                      className="mainPhotoAreaImg"
                      alt="studioPicture"
                      src={concept.originalUrl}
                    />
                    <div>
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
                    </div>
                  </Swipe>
                )}
              </div>
              <div className="toStudioInfoContainer">
                {history.location.pathname ===
                `/studios/${studioSlug || concept.studio.slug}` ? (
                  <div className="toStudioInfo" onClick={() => close()}>
                    <div>스튜디오 정보 보기</div>
                  </div>
                ) : (
                  <div
                    className="toStudioInfo"
                    onClick={() => {
                      history.push({
                        pathname: `/studios/${
                          studioSlug || concept.studio.slug
                        }`,
                        state: { previousPath: history.location.pathname },
                      });
                      window.scrollTo(0, 0);
                    }}
                  >
                    스튜디오 정보 보기
                  </div>
                )}

                {RenderedHeart}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
