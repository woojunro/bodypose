import React, { useState, useContext } from 'react';
import { client } from '../../../apollo';
import { IoIosClose } from 'react-icons/io';
import { Link, useHistory } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import LoginContext from '../../../contexts/LoginContext';
import { useMutation } from '@apollo/client';
import {
  DISHEART_STUDIO_PHOTO_MUTATION,
  HEART_STUDIO_PHOTO_MUTATION,
} from '../../../gql/mutations/HeartStudioPhotoMutation';

const Modal = ({ isOpen, close, concept }) => {
  const [isHearted, setIsHearted] = useState(concept.isHearted);
  const LoggedIn = useContext(LoginContext);
  const history = useHistory();

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
    onCompleted: (data) => {
      if (data.heartStudioPhoto.ok) {
        changeIsHearted();
      }
    },
  });

  const [disheartStudioPhoto] = useMutation(DISHEART_STUDIO_PHOTO_MUTATION, {
    onError: () => alert('오류가 발생하였습니다. 다시 시도해주세요.'),
    onCompleted: (data) => {
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
      {isOpen ? (
        <div>
          <div className="conceptmodal">
            <div className="concepttrueModal">
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
                  <img alt="studioPicture" src={concept.originalUrl} />
                </div>
              </div>
              <div className="toStudioInfoContainer">
                <div
                  className="toStudioInfo"
                  onClick={() => {
                    history.push({
                      pathname: `/studios/${concept.studio.slug}`,
                      state: { previousPath: history.location.pathname },
                    });
                    window.scrollTo(0, 0);
                  }}
                >
                  스튜디오 정보 보기
                </div>
                {RenderedHeart}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
