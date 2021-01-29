import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import ReviewStars from './ReviewStars';
import './WriteReview.css';
import Camera from '../../../materials/icons/camera.png';
import { SaveReviewToDb } from '../../functions/WithDb/Review';
import imageCompression from 'browser-image-compression';
const WriteReview = ({
  studioName,
  studioTitle,
  isWriteReviewOpen,
  setIsWriteReviewOpen,
}) => {
  const [onlyVerify, setOnlyVerify] = useState(false);
  //Blob의 array로 저장됨.
  const [pics, setPics] = useState([]);
  const [imgBase64, setimgBase64] = useState([]);
  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [picNumberError, setPicNumberError] = useState(false);
  const [mainNumber, setMainNumber] = useState(0);

  const hiddenFileInput = React.useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    console.log(files);
    let compressedFiles = [];
    const option = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    Promise.all(
      files.map((file) => {
        return new Promise(async (resolve, reject) => {
          const compressedFile = await imageCompression(file, option);
          const reader = new FileReader();
          reader.addEventListener('load', (ev) => {
            resolve(ev.target.result);
          });
          reader.addEventListener('error', reject);
          reader.readAsDataURL(compressedFile);
          compressedFiles.push(compressedFile);
          console.log(compressedFile);
        });
      })
    ).then(
      (images) => {
        setimgBase64(images);
      },
      (error) => {
        console.error(error);
      }
    );

    if (files.length > 3) {
      setPicNumberError(true);
    } else setPicNumberError(false);

    setPics(compressedFiles);
  };

  useEffect(() => {
    if (pics < 1) {
      setPicNumberError(true);
    } else {
      setPicNumberError(false);
    }
  }, [pics]);

  const handleSubmit = () => {
    if (reviewText.length < 12 || picNumberError) {
    } else {
      if (onlyVerify) {
        setMainNumber(-1);
      }
      SaveReviewToDb(studioName, reviewText, pics, mainNumber);
      setIsWriteReviewOpen(false);
      window.location.reload();
    }
  };

  const renderedPics = () => {
    if (pics.length === 1) {
      return (
        <div className="previewPic" onClick={() => setMainNumber(0)}>
          {mainNumber === 0 ? <div className="mainPicText">대표</div> : null}

          <img id="firstPic" src={imgBase64[0]} alt="" />
        </div>
      );
    } else if (pics.length === 2) {
      return (
        <>
          <div className="previewPic" onClick={() => setMainNumber(0)}>
            {mainNumber === 0 ? <div className="mainPicText">대표</div> : null}

            <img src={imgBase64[0]} alt="" />
          </div>
          <div className="previewPic" onClick={() => setMainNumber(1)}>
            {mainNumber === 1 ? <div className="mainPicText">대표</div> : null}

            <img src={imgBase64[1]} alt="" />
          </div>
        </>
      );
    } else if (pics.length === 3) {
      return (
        <>
          <div className="previewPic" onClick={() => setMainNumber(0)}>
            {mainNumber === 0 ? <div className="mainPicText">대표</div> : null}

            <img src={imgBase64[0]} alt="" />
          </div>

          <div className="previewPic" onClick={() => setMainNumber(1)}>
            {mainNumber === 1 ? <div className="mainPicText">대표</div> : null}

            <img src={imgBase64[1]} alt="" />
          </div>
          <div className="previewPic" onClick={() => setMainNumber(2)}>
            {mainNumber === 2 ? <div className="mainPicText">대표</div> : null}

            <img src={imgBase64[2]} alt="" />
          </div>
        </>
      );
    } else return null;
  };

  return isWriteReviewOpen ? (
    <div className="writeReview">
      <div className="reviewContainer">
        <div className="reviewTopContainer">
          <FiArrowLeft
            className="usersGoBackArrow"
            onClick={() => {
              setIsWriteReviewOpen(false);
            }}
          />

          <div className="reviewCompelteButton" onClick={handleSubmit}>
            완료
          </div>
        </div>
        <div className="titleAndStars">
          <div>{studioTitle}</div>
          <ReviewStars stars={stars} setStars={setStars} />
          <div className="pleaseStar">별점을 남겨주세요</div>
        </div>
        <div className="reviewMainPart">
          <div className="picturesPart">
            <div onClick={handleClick} className="addReviewPicButton">
              <img alt="addPic" src={Camera} />
              <div>사진 {pics.length}/3</div>
            </div>

            {renderedPics()}
          </div>

          <input
            style={{ marginTop: '10px' }}
            type="file"
            accept="image/jpg,image/png,image/jpeg"
            ref={hiddenFileInput}
            multiple
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            실제 촬영 인증을 위해 최소 1장의 사진이 필요합니다.
          </div>

          <div className="mozaikPart">
            <input
              type="checkbox"
              value={onlyVerify}
              onChange={() => {
                setOnlyVerify(!onlyVerify);
                setMainNumber(-1);
              }}
              style={{ width: '15px', height: '15px' }}
            />
            <div
              style={{ fontSize: '12px', marginLeft: '5px', color: 'black' }}
            >
              체크박스에 체크하시면, 사진은 인증 용도로만 이용되고 즉시
              삭제됩니다.
            </div>
          </div>

          <div className="reviewTextPart">
            <form>
              <textarea
                className="reviewTextArea"
                value={reviewText}
                placeholder="솔직한 리뷰는 많은 분들꼐 도움이 됩니다. (12자 이상)"
                onChange={(e) => {
                  setReviewText(e.target.value);
                }}
              />
            </form>
            {reviewText.length < 12 ? (
              <div
                style={{ color: 'red', fontSize: '12px', paddingLeft: '5px' }}
              >
                총 글자 수는 12글자가 넘어야합니다.
              </div>
            ) : null}
            <div className="reviewTextNotice">
              게시물에 부적절한 사진 혹은 표현이 포함된다면, 경고 없이 삭제될 수
              있습니다. 근거없는 비난이나 타인에게 불쾌감을 줄 수 있는 표현은
              자제 바랍니다.
            </div>
          </div>

          <div className="reviewBottomNoticeContainer">
            <div className="reviewBottomNotice">
              솔직하게 작성하신 리뷰는 주문을 괸하는 분들께 큰 도움이 됩니다.
              하지만 허위 리뷰나 명예훼손, 욕설, 비방글 등 선량한 업주나 제3자의
              권리를 침해하는 게시물은 서비스 이용약관이나 관련 법률에 따라
              제재를 받을 수 있습니다. 에프먼스는 위와 같은 게시물 작성자에게
              경고, 주의 등의 조치를 취할 수 있고, 해당 게시물을 삭제할 수
              있습니다. 게시에 따른 책임은 작성자에게 있으며, 에프먼스는 이에
              대한 법적 책임을 지지 않습니다.
            </div>
          </div>
        </div>{' '}
      </div>
    </div>
  ) : null;
};

export default WriteReview;
