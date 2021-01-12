import React, { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { ChangeIsHearted } from '../../../components/functions/WithDb/ChangeIsHearted';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
const Modal = ({ isOpen, close, concept }) => {
  const [isHearted, setIsHearted] = useState(concept.isHearted);

  const ChangeHeart = () => {
    ChangeIsHearted();
    setIsHearted(!isHearted);
  };
  return (
    <>
      {isOpen ? (
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
              <Link to={`/studios/${concept.studio}`} className="toStudioInfo">
                <div>스튜디오 정보 보기</div>
              </Link>
              {isHearted ? (
                <div
                  onClick={() => {
                    ChangeHeart();
                  }}
                >
                  <FaHeart className="conceptFilledHeart" />
                </div>
              ) : (
                <div
                  onClick={() => {
                    ChangeHeart();
                  }}
                >
                  <FaRegHeart className="conceptRegHeart" />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
