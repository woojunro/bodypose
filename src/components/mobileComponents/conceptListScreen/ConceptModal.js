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
import $ from 'jquery';

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

  const LoggedIn = useContext(LoginContext);
  const [isHearted, setIsHearted] = useState(concept.isHearted);

  const [disheartLoading, setDisHeartLoading] = useState(false);
  const history = useHistory();

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
    onCompleted: (data) => {
      if (data.heartStudioPhoto.ok) {
        changeIsHearted(data.heartStudioPhoto.id, true);
      }
    },
  });

  const [disheartStudioPhoto] = useMutation(DISHEART_STUDIO_PHOTO_MUTATION, {
    onError: () => close(),
    onCompleted: (data) => {
      if (data.disheartStudioPhoto.ok) {
        changeIsHearted(data.disheartStudioPhoto.id, false);
        if (isForHeart) {
          close();
        }
      }
    },
  });

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
                <div className="studioTitle">
                  {studioName ? studioName : concept.studio.name}
                </div>
                <IoIosClose
                  className="conceptModalClose"
                  onClick={() => {
                    close();
                    history.goBack();
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
                `/studios/${studioSlug || concept.studio.slug}` ? (
                  <div className="toStudioInfo" onClick={() => close()}>
                    <div>스튜디오 정보 보기</div>
                  </div>
                ) : (
                  <Link
                    to={{
                      pathname: `/studios/${studioSlug || concept.studio.slug}`,
                      state: { previousPath: history.location.pathname },
                    }}
                    className="toStudioInfo"
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div>스튜디오 정보 보기</div>
                  </Link>
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
