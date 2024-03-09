import React, { useState, useEffect } from 'react';
import {
  CONTACT_STUDIO_KAKAO_ID_PREFIX,
  CONTACT_STUDIO_KAKAO_PHONE_PREFIX,
} from '../../constants/urls';
import openInNewTab from '../function/openInNewTab';
import './SetLink.css';

// 링크 타입
// URL = 링크
// KAKAO_ID = 카카오 ID
// PHONE = 연락처

const SetLink = ({
  title = '',
  currentLink = '',
  link = '',
  setLink = () => {},
}) => {
  const [linkType, setLinkType] = useState('URL');
  const [text, setText] = useState('');

  // 링크의 마지막 부분 가져오기
  const getSuffix = url => {
    const words = url.split('/');
    setText(words[words.length - 1]);
  };

  useEffect(() => {
    if (currentLink) {
      if (currentLink.startsWith(CONTACT_STUDIO_KAKAO_ID_PREFIX)) {
        // Kakao ID
        setLinkType('KAKAO_ID');
        getSuffix(currentLink);
      } else if (currentLink.startsWith(CONTACT_STUDIO_KAKAO_PHONE_PREFIX)) {
        // Kakao phone
        setLinkType('PHONE');
        getSuffix(currentLink);
      } else {
        setText(currentLink);
      }
    }
  }, [currentLink]);

  //카카오 아이디면 카카오 아이디 링크 만들어서 저장해주기.
  useEffect(() => {
    const saveID = id => {
      setLink(CONTACT_STUDIO_KAKAO_ID_PREFIX + id);
    };

    const savePhone = number => {
      setLink(CONTACT_STUDIO_KAKAO_PHONE_PREFIX + number);
    };

    const addHttps = url => {
      if (url.startsWith('http')) {
        setLink(url);
      } else {
        const urlToSave = 'http://' + url;
        setLink(urlToSave);
      }
    };

    if (text) {
      if (linkType === 'KAKAO_ID') {
        saveID(text);
      } else if (linkType === 'PHONE') {
        savePhone(text);
      } else {
        addHttps(text);
      }
    }
  }, [text, linkType, setLink]);

  const handleOpenUrl = () => {
    if (text.length > 0) {
      openInNewTab(link);
    }
  };

  return (
    <div className="infoItemContainer">
      <div className="setLinkTitle">
        {title}
        <select
          className="linkTypeSelector"
          value={linkType}
          onChange={e => setLinkType(e.target.value)}
        >
          <option value="URL">링크</option>
          <option value="KAKAO_ID">카카오톡 ID</option>
          <option value="PHONE">연락처</option>
        </select>
      </div>
      <div>
        <input
          className="linkInput"
          value={text}
          placeholder={linkType === 'URL' ? 'https://' : ''}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <div className="linkPreview" onClick={handleOpenUrl}>
        미리보기
      </div>
    </div>
  );
};

export default SetLink;
