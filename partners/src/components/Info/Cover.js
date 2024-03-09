import React, { useState } from 'react';
import './Cover.css';
import Modal from 'react-responsive-modal';
import API_URLS from '../../constants/urls';
import {
  compressOriginalPhoto,
  compressThumbnailPhoto,
} from '../function/compressImage';
import { useReactiveVar } from '@apollo/client';
import { MyStudioSlugVar } from '../../graphql/variables';
import axios from 'axios';
import { ERROR_MESSAGE } from '../../constants/errorMessages';
import useRefresh from '../../hooks/useRefresh';

const Cover = ({ refetch = () => {}, currentCoverUrl, currentLogoUrl }) => {
  const myStudioSlug = useReactiveVar(MyStudioSlugVar);
  const refresh = useRefresh();

  const [newCover, setNewCover] = useState(null);
  const [newCoverUrl, setNewCoverUrl] = useState('');
  const [newLogo, setNewLogo] = useState(null);
  const [newLogoUrl, setNewLogoUrl] = useState('');

  const [isCoverPreviewOpen, setIsCoverPreviewOpen] = useState(false);
  const [isLogoPreviewOpen, setIsLogoPreviewOpen] = useState(false);

  // input에 적용할 ref
  const coverRef = React.useRef();
  const logoRef = React.useRef();

  const closeCoverPreview = () => {
    setIsCoverPreviewOpen(false);
    coverRef.current.files = new DataTransfer().files;
  };

  const closeLogoPreview = () => {
    setIsLogoPreviewOpen(false);
    logoRef.current.files = new DataTransfer().files;
  };

  const handleCoverChange = async event => {
    event.preventDefault();
    const cover = event.target.files[0];
    const compressedCover = await compressOriginalPhoto(cover);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewCover(compressedCover);
      setNewCoverUrl(reader.result);
      setIsCoverPreviewOpen(true);
    };
    reader.readAsDataURL(compressedCover);
  };

  const uploadCover = async () => {
    const url = API_URLS.UPLOAD_STUDIO_COVER;
    const formData = new FormData();
    formData.append('studioSlug', myStudioSlug);
    formData.append('cover', newCover);

    try {
      const res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.ok) {
        await refetch();
        refresh();
      } else {
        alert(ERROR_MESSAGE);
      }
    } catch (e) {
      alert(ERROR_MESSAGE);
    }
  };

  const handleLogoChange = async event => {
    event.preventDefault();
    const logo = event.target.files[0];
    const compressedLogo = await compressThumbnailPhoto(logo);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewLogo(compressedLogo);
      setNewLogoUrl(reader.result);
      setIsLogoPreviewOpen(true);
    };
    reader.readAsDataURL(compressedLogo);
  };

  const uploadLogo = async () => {
    const url = API_URLS.UPLOAD_STUDIO_LOGO;
    const formData = new FormData();
    formData.append('studioSlug', myStudioSlug);
    formData.append('logo', newLogo);

    try {
      const res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.ok) {
        await refetch();
        refresh();
      } else {
        alert(ERROR_MESSAGE);
      }
    } catch (e) {
      alert(ERROR_MESSAGE);
    }
  };

  return (
    <>
      <div className="fullSizeBox">
        <div className="boxTitle">대표 사진, 로고</div>
        <div className="coverContainer">
          <div className="coverTitle">대표 사진</div>
          <div>
            <div className="photoContainer">
              <div>
                <div className="thumb">
                  {currentCoverUrl ? (
                    <img src={currentCoverUrl} alt="스튜디오 대표 사진" />
                  ) : (
                    <div>대표 사진 없음</div>
                  )}
                </div>
              </div>
            </div>
            <label htmlFor="coverPhotoInput" className="imageInputLabel">
              변경하기
            </label>
            <input
              id="coverPhotoInput"
              className="imageInput"
              ref={coverRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple={false}
              onChange={handleCoverChange}
            />
          </div>
        </div>
        <div className="coverContainer">
          <div className="coverTitle">로고</div>
          <div>
            <div className="photoContainer">
              <div>
                <div className="logo">
                  {currentLogoUrl ? (
                    <img src={currentLogoUrl} alt="스튜디오 로고 사진" />
                  ) : (
                    <div>로고 없음</div>
                  )}
                </div>
              </div>
            </div>
            <label htmlFor="logoInput" className="imageInputLabel">
              변경하기
            </label>
            <input
              id="logoInput"
              className="imageInput"
              ref={logoRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple={false}
              onChange={handleLogoChange}
            />
          </div>
        </div>
      </div>
      <Modal open={isCoverPreviewOpen} center onClose={closeCoverPreview}>
        <div className="imagePreviewModal">
          <h3>미리보기</h3>
          <div className="centeredDiv">
            <img
              className="coverPhotoPreview"
              src={newCoverUrl}
              alt="변경될 스튜디오 대표 사진"
            />
            <div className="confirmPreviewButton" onClick={uploadCover}>
              스튜디오 대표 사진으로 설정
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={isLogoPreviewOpen} center onClose={closeLogoPreview}>
        <div className="imagePreviewModal">
          <h3>미리보기</h3>
          <div className="centeredDiv">
            <img
              className="logoPreview"
              src={newLogoUrl}
              alt="변경될 스튜디오 로고 사진"
            />
            <div className="confirmPreviewButton" onClick={uploadLogo}>
              스튜디오 로고로 설정
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Cover;
