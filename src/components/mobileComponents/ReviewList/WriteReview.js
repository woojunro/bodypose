import React, { useState } from 'react';
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
  const [needMozaik, setNeedMozaik] = useState(false);
  const [pics, setPics] = useState([]);
  const [imgBase64, setimgBase64] = useState([]);
  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [picNumberError, setPicNumberError] = useState(false);

  const hiddenFileInput = React.useRef(null);
  console.log(pics);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const files = Array.from(event.target.files);

    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.addEventListener('load', (ev) => {
            resolve(ev.target.result);
          });
          reader.addEventListener('error', reject);
          reader.readAsDataURL(file);
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

    setPics(files);
  };

  const handleSubmit = () => {
    if (reviewText.length < 12 || picNumberError) {
      console.log('부족함');
    } else {
      SaveReviewToDb(studioName, reviewText, pics);
      setIsWriteReviewOpen(false);
      window.location.reload();
    }
  };

  const renderedPics = () => {
    if (pics.length === 1) {
      return (
        <div className="previewPic">
          <img src={imgBase64[0]} alt="" />
        </div>
      );
    } else if (pics.length === 2) {
      return (
        <>
          <div className="previewPic">
            <img src={imgBase64[0]} alt="" />
          </div>
          <div className="previewPic">
            <img src={imgBase64[1]} alt="" />
          </div>
        </>
      );
    } else if (pics.length === 3) {
      return (
        <>
          <div className="previewPic">
            <img src={imgBase64[0]} alt="" />
          </div>
          <div className="previewPic">
            <img src={imgBase64[1]} alt="" />
          </div>
          <div className="previewPic">
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
          {picNumberError ? (
            <div className="picNumberError">
              사진은 3장을 초과할 수 없습니다.
            </div>
          ) : null}
          <input
            style={{ marginTop: '10px' }}
            type="file"
            accept="image/jpg,image/png,image/jpeg"
            multiple
            ref={hiddenFileInput}
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          <div className="mozaikPart">
            <input
              type="checkbox"
              value={needMozaik}
              onChange={() => setNeedMozaik(!needMozaik)}
              style={{ width: '15px', height: '15px' }}
            />
            <div style={{ fontSize: '12px', marginLeft: '5px' }}>
              얼굴(코,입) 모자이크 처리하기
            </div>
          </div>

          <div className="mozaikNotice">
            얼굴 모자이크 처리를 사용하시는 경우, 서버 상황에 따라 게시까지 몇
            시간이 소요될 수 있습니다.
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
