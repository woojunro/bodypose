import React, { useState, useContext } from 'react';
import { IoIosClose } from 'react-icons/io';
import { Link, useHistory } from 'react-router-dom';
import { ChangeIsHearted } from '../../../components/functions/WithDb/ChangeIsHearted';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import LoginContext from '../../../contexts/LoginContext';

const Modal = ({ isOpen, close, concept }) => {
  const [isHearted, setIsHearted] = useState(concept.isHearted);
  const LogedIn = useContext(LoginContext);
  const history = useHistory();

  const ChangeHeart = () => {
    ChangeIsHearted();
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
    if (LogedIn.logedIn) {
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
              <div className="topBarContainer">
                <div style={{ width: '45px' }}></div>
                <div className="studioTitle">{concept.title}</div>
                <IoIosClose
                  onClick={() => {
                    close();
                  }}
                />
              </div>
              <div className="conceptModalContents">
                <div className="mainPhotoArea">
                  <img alt="studioPicture" src={concept.pic} />
                </div>
              </div>
              <div className="toStudioInfoContainer">
                <Link
                  to={`/studios/${concept.studio}`}
                  className="toStudioInfo"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div>스튜디오 정보 보기</div>
                </Link>
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
