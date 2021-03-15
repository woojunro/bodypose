import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import ReviewStars from './ReviewStars';
import './WriteReview.css';
import Camera from '../../../materials/icons/camera.png';
import imageCompression from 'browser-image-compression';
import LoadingIcon from '../conceptListScreen/LoadingIcon';
import axios from 'axios';
import { BASE_URL } from '../../../constants/urls';

const WriteReview = ({
  studioName,
  studioTitle,
  isWriteReviewOpen,
  setIsWriteReviewOpen,
  refetchReviews,
  refetchStudio,
}) => {
  const [onlyVerify, setOnlyVerify] = useState(false);
  //Blob의 array로 저장됨.
  const [pics, setPics] = useState([]);
  const [imgBase64, setimgBase64] = useState([]);
  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [mainNumber, setMainNumber] = useState(0);

  const [submitLoading, setSubmitLoading] = useState(false);

  const hiddenFileInput = React.useRef(null);
  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const handleChange = event => {
    const files = Array.from(event.target.files);
    let compressedFiles = [];
    const option = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    if (files.length > 3) {
      alert('리뷰 사진은 3장을 초과할 수 없습니다.');
      return;
    }

    Promise.all(
      files.map(file => {
        return new Promise(async (resolve, reject) => {
          const compressedFile = await imageCompression(file, option);
          const reader = new FileReader();
          reader.addEventListener('load', ev => {
            resolve(ev.target.result);
          });
          reader.addEventListener('error', reject);
          reader.readAsDataURL(compressedFile);
          compressedFiles.push(compressedFile);
        });
      })
    ).then(
      images => {
        setimgBase64(images);
      },
      error => {
        console.error(error);
      }
    );

    setPics(compressedFiles);
  };

  useEffect(() => {
    if (onlyVerify) {
      setMainNumber(-1);
    } else {
      setMainNumber(0);
    }
  }, [onlyVerify]);

  const canSubmit = () =>
    !Number.isInteger(stars) ||
    stars < 1 ||
    stars > 5 ||
    pics.length < 1 ||
    pics.length > 3 ||
    reviewText.length < 12
      ? false
      : onlyVerify
      ? true
      : mainNumber >= 0 && mainNumber < pics.length;

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const form = new FormData();
    form.append('studioSlug', studioName);
    form.append('rating', `${stars}`);
    form.append('text', reviewText);
    form.append('isPhotoForProof', onlyVerify ? 'true' : '');
    form.append('thumbnailIndex', onlyVerify ? '0' : `${mainNumber}`);
    for (const pic of pics) {
      form.append('photos', pic, pic.name);
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/uploads/studio-review`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        }
      );
      if (response.data.ok) {
        setIsWriteReviewOpen(false);
        refetchReviews();
        refetchStudio();
      } else {
        throw new Error();
      }
    } catch (e) {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
    }
    setSubmitLoading(false);
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
    submitLoading ? (
      <div className="writeReview writeReviewCenter">
        <LoadingIcon />
      </div>
    ) : (
      <div className="writeReview">
        <div className="reviewContainer">
          <div className="reviewTopContainer">
            <FiArrowLeft
              className="usersGoBackArrow"
              onClick={() => {
                setIsWriteReviewOpen(false);
              }}
            />

            <div
              className={`reviewCompleteButton ${
                !canSubmit() && 'reviewCompleteButtonInActive'
              }`}
              onClick={canSubmit() ? handleSubmit : () => {}}
            >
              완료
            </div>
          </div>
          <div className="titleAndStars">
            <div>{studioTitle}</div>
            <ReviewStars stars={stars} setStars={setStars} />
            {stars === 0 && <div className="pleaseStar">별점을 남겨주세요</div>}
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
              style={{ display: 'none' }}
              type="file"
              accept="image/jpg,image/png,image/jpeg"
              ref={hiddenFileInput}
              multiple
              onChange={handleChange}
            />

            <div style={{ fontSize: '12px', marginTop: '20px' }}>
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
                  onChange={e => {
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
                게시물에 부적절한 사진 혹은 표현이 포함된다면, 경고 없이 삭제될
                수 있습니다. 근거없는 비난이나 타인에게 불쾌감을 줄 수 있는
                표현은 자제 바랍니다.
              </div>
            </div>

            <div className="reviewBottomNoticeContainer">
              <div className="reviewBottomNotice">
                솔직하게 작성하신 리뷰는 예약을 고민하는 분들께 큰 도움이
                됩니다. 하지만 허위 리뷰나 명예훼손, 욕설, 비방글 등 선량한
                업주나 제3자의 권리를 침해하는 게시물은 서비스 이용약관이나 관련
                법률에 따라 제재를 받을 수 있습니다. 에프먼스는 위와 같은 게시물
                작성자에게 경고, 주의 등의 조치를 취할 수 있고, 해당 게시물을
                삭제할 수 있습니다. 게시에 따른 책임은 작성자에게 있으며,
                에프먼스는 이에 대한 법적 책임을 지지 않습니다.
              </div>
            </div>
          </div>{' '}
        </div>
      </div>
    )
  ) : null;
};

export default WriteReview;
