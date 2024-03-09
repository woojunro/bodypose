import React, { useEffect, useState } from 'react';
import useRefresh from '../../hooks/useRefresh';
import './AddPhoto.css';
import genderOptions from '../../constants/gender';
import ChangeButton from '../ChangeButton';
import {
  compressOriginalPhoto,
  compressThumbnailPhoto,
} from '../function/compressImage';
import {
  NUDE_COSTUME_SLUG,
  NO_OBJECT_SLUG,
} from '../../constants/photoConcept';
import { useReactiveVar } from '@apollo/client';
import { MyStudioSlugVar } from '../../graphql/variables';
import axios from 'axios';
import API_URLS from '../../constants/urls';
import { ERROR_MESSAGE } from '../../constants/errorMessages';

const AddPhoto = ({ concepts }) => {
  const studioSlug = useReactiveVar(MyStudioSlugVar);
  const refresh = useRefresh();

  //input에 적용할 ref
  const ref = React.useRef();

  // 사진의 option들 불러오기
  const { backgroundConcepts, costumeConcepts, objectConcepts } = concepts;

  const [gender, setGender] = useState('');
  const [backgroundConceptSlugs, setBackgroundConceptSlugs] = useState([]);
  const [costumeConceptSlugs, setCostumeConceptSlugs] = useState([]);
  const [objectConceptSlugs, setObjectConceptSlugs] = useState([]);

  const [thumbnail, setThumbnail] = useState(null);
  const [original, setOriginal] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');

  const [loading, setLoading] = useState(false);

  // 추가하기 누르면 사진 추가하기
  const savePhotoData = () => {
    // validations
    if (!(thumbnail && original)) {
      alert('사진을 선택해주세요.');
      return;
    }
    if (!gender) {
      alert('성별을 선택해주세요.');
      return;
    }
    if (backgroundConceptSlugs.length === 0) {
      alert('배경 컨셉을 최소 하나 선택해주세요.');
      return;
    }
    if (costumeConceptSlugs.length === 0) {
      alert('의상 컨셉을 최소 하나 선택해주세요.');
      return;
    }
    if (objectConceptSlugs.length === 0) {
      alert('도구 컨셉을 최소 하나 선택해주세요.');
      return;
    }

    setLoading(true);

    const form = new FormData();
    form.append('studioSlug', studioSlug);
    form.append('thumbnail', thumbnail);
    form.append('original', original);
    form.append('gender', gender);
    form.append('backgroundConceptSlugs', backgroundConceptSlugs.join(','));
    form.append('costumeConceptSlugs', costumeConceptSlugs.join(','));
    form.append('objectConceptSlugs', objectConceptSlugs.join(','));

    axios
      .post(API_URLS.UPLOAD_STUDIO_PHOTO, form)
      .then(res => {
        setLoading(false);
        if (res.data.ok) {
          refresh();
        } else {
          alert('업로드 중 ' + ERROR_MESSAGE);
        }
      })
      .catch(() => {
        setLoading(false);
        alert('업로드 중 ' + ERROR_MESSAGE);
      });
  };

  const handleOriginalChange = async event => {
    const photo = event.target.files[0];
    if (!photo) return;
    const reader = new FileReader();

    // compress
    const compressedThumbnail = await compressThumbnailPhoto(photo);
    const compressedOriginal = await compressOriginalPhoto(photo);

    reader.onloadend = () => {
      setOriginalUrl(reader.result);
      setThumbnail(compressedThumbnail);
      setOriginal(compressedOriginal);
    };

    // extract image url
    reader.readAsDataURL(photo);
  };

  const onImageDelete = () => {
    // clear input
    ref.current.type = '';
    ref.current.type = 'file';

    // clear photo states
    setThumbnail(null);
    setOriginal(null);
    setOriginalUrl('');

    // clear option states
    setGender('');
    setBackgroundConceptSlugs([]);
    setCostumeConceptSlugs([]);
    setObjectConceptSlugs([]);
  };

  // option들 제어
  const handleConcept = (concepts, setConcepts, option) => {
    if (concepts.includes(option)) {
      setConcepts(concepts.filter(concept => concept !== option));
    } else {
      setConcepts([...concepts, option]);
    }
  };

  const handleOnlyOption = (options, setOptions, onlyOptionSlug) => {
    // only option 선택 시 나머지 option 모두 해제
    // 다른 옵션 선택 시 only option 해제
    if (options.length < 2) return;
    // find index
    const index = options.findIndex(slug => slug === onlyOptionSlug);
    // no only option
    if (index === -1) return;
    if (index === 0) {
      // another option added
      setOptions(options.slice(1));
    } else {
      // only option added
      setOptions([onlyOptionSlug]);
    }
  };

  useEffect(() => {
    handleOnlyOption(
      costumeConceptSlugs,
      setCostumeConceptSlugs,
      NUDE_COSTUME_SLUG
    );
  }, [costumeConceptSlugs]);

  useEffect(() => {
    handleOnlyOption(objectConceptSlugs, setObjectConceptSlugs, NO_OBJECT_SLUG);
  }, [objectConceptSlugs]);

  return (
    <div className="fullSizeBox">
      <div className="boxTitle">사진 추가</div>
      <div className="addPhotoContainer">
        <div className="addPhotoLine">
          <div className="addPhotoTitle">사진 선택</div>
          <input
            ref={ref}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple={false}
            onChange={handleOriginalChange}
          />
        </div>
        <div className="addPhotoLine">
          <div className="addPhotoTitle">미리보기</div>
          <div className="thumbnailPic">
            {originalUrl && <img src={originalUrl} alt="미리보기" />}
          </div>
        </div>
        <div className="addPhotoLine">
          <div className="addPhotoTitle">성별</div>
          <div className="photoOptions">
            {Object.keys(genderOptions).map(option => (
              <span className="option" key={option}>
                <input
                  className="optionCheckBox"
                  type="checkbox"
                  value={option}
                  checked={gender === option}
                  onChange={() => setGender(option)}
                />
                {genderOptions[option]}
              </span>
            ))}
          </div>
        </div>
        <div className="addPhotoLine">
          <div className="addPhotoTitle">
            배경 컨셉
            <div className="addPhotoDiscription">중복 선택 가능</div>
          </div>
          <div className="photoOptions">
            {backgroundConcepts.map(concept => (
              <span className="option" key={concept.slug}>
                <input
                  className="optionCheckBox"
                  type="checkbox"
                  checked={backgroundConceptSlugs.includes(concept.slug)}
                  onChange={() =>
                    handleConcept(
                      backgroundConceptSlugs,
                      setBackgroundConceptSlugs,
                      concept.slug
                    )
                  }
                />
                {concept.name}
              </span>
            ))}
          </div>
        </div>
        <div className="addPhotoLine">
          <div className="addPhotoTitle">
            의상 컨셉
            <div className="addPhotoDiscription">중복 선택 가능</div>
          </div>
          <div className="photoOptions">
            {costumeConcepts.map(concept => (
              <span className="option" key={concept.slug}>
                <input
                  className="optionCheckBox"
                  type="checkbox"
                  checked={costumeConceptSlugs.includes(concept.slug)}
                  onChange={() =>
                    handleConcept(
                      costumeConceptSlugs,
                      setCostumeConceptSlugs,
                      concept.slug
                    )
                  }
                />
                {concept.name}
              </span>
            ))}
          </div>
        </div>
        <div className="addPhotoLine">
          <div className="addPhotoTitle">
            도구 컨셉
            <div className="addPhotoDiscription">중복 선택 가능</div>
          </div>
          <div className="photoOptions">
            {objectConcepts.map(concept => (
              <span className="option" key={concept.slug}>
                <input
                  className="optionCheckBox"
                  type="checkbox"
                  checked={objectConceptSlugs.includes(concept.slug)}
                  onChange={() =>
                    handleConcept(
                      objectConceptSlugs,
                      setObjectConceptSlugs,
                      concept.slug
                    )
                  }
                />
                {concept.name}
              </span>
            ))}
          </div>
        </div>
        <div className="buttonsContainer">
          <div className="buttons">
            <ChangeButton buttonName="초기화" onClick={onImageDelete} isGray />
            <ChangeButton
              buttonName="추가하기"
              onClick={savePhotoData}
              isActive={!loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPhoto;
