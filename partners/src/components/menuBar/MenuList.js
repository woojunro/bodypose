import { React, useEffect, useState } from 'react';
import './MenuList.css';
import { IoIosArrowDown } from 'react-icons/io';
import { IoIosArrowUp } from 'react-icons/io';
import { useHistory, useLocation } from 'react-router-dom';
import {
  LoggedInPaths as Paths,
  PRODUCTS_PATH_PREFIX,
  STUDIO_PATH_PREFIX,
} from '../../routers/LoggedInRouter';

const MenuElement = ({ elementName, onClick }) => {
  return (
    <div className="MenuElement" onClick={onClick}>
      {elementName}
    </div>
  );
};

const OpenMenuElement = ({ elementName, onClick, isOpen }) => (
  <div className="OpenMenuElement" onClick={onClick}>
    <div className="MenuElement">{elementName}</div>
    {isOpen ? (
      <IoIosArrowUp className="menuArrow" />
    ) : (
      <IoIosArrowDown className="menuArrow" />
    )}
  </div>
);

const MenuList = () => {
  const [isStudioGroupOpen, setIsStudioGroupOpen] = useState(false);
  const [isProductGroupOpen, setIsProductGroupOpen] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith(PRODUCTS_PATH_PREFIX)) {
      setIsStudioGroupOpen(false);
      setIsProductGroupOpen(true);
    } else if (pathname.startsWith(STUDIO_PATH_PREFIX)) {
      setIsStudioGroupOpen(true);
      setIsProductGroupOpen(false);
    } else {
      setIsStudioGroupOpen(false);
      setIsProductGroupOpen(false);
    }
  }, [pathname]);

  return (
    <div className="MenuList">
      <div className="MenuElementContainer">
        <MenuElement
          elementName="홈"
          onClick={() => history.push(Paths.DASHBOARD)}
        />
        <MenuElement
          elementName="내 정보 관리"
          onClick={() => history.push(Paths.MY_INFO)}
        />
        <OpenMenuElement
          elementName="스튜디오 관리"
          onClick={() => setIsStudioGroupOpen(!isStudioGroupOpen)}
          isOpen={isStudioGroupOpen}
        />
        {isStudioGroupOpen && (
          <div className="subListContainer">
            <div
              className="subListElement"
              onClick={() => history.push(Paths.STUDIO_INFO)}
            >
              스튜디오 정보
            </div>
            <div
              className="subListElement"
              onClick={() => history.push(Paths.STUDIO_BRANCH)}
            >
              스튜디오 지점
            </div>
          </div>
        )}
        <MenuElement
          elementName="포트폴리오 관리"
          onClick={() => history.push(Paths.PHOTO)}
        />
        <OpenMenuElement
          elementName="상품 관리"
          onClick={() => setIsProductGroupOpen(!isProductGroupOpen)}
          isOpen={isProductGroupOpen}
        />
        {isProductGroupOpen && (
          <div className="subListContainer">
            <div
              className="subListElement"
              onClick={() => history.push(Paths.PRODUCT_GENERAL)}
            >
              일반
            </div>
            <div
              className="subListElement"
              onClick={() => history.push(Paths.STUDIO_PRODUCT)}
            >
              스튜디오 상품
            </div>
            <div
              className="subListElement"
              onClick={() => history.push(Paths.OUTDOOR_PRODUCT)}
            >
              아웃도어 상품
            </div>
            <div
              className="subListElement"
              onClick={() => history.push(Paths.HAIR_MAKEUP)}
            >
              헤어/메이크업
            </div>
            <div
              className="subListElement"
              onClick={() => history.push(Paths.OPTIONAL_PRODUCT)}
            >
              추가 상품
            </div>
          </div>
        )}
        <MenuElement
          elementName="소식/이벤트 관리"
          onClick={() => history.push(Paths.NEWS)}
        />
        <MenuElement
          elementName="통계"
          onClick={() => history.push(Paths.STATISTICS)}
        />
        <MenuElement
          elementName="공지사항"
          onClick={() => history.push(Paths.NOTICE)}
        />
      </div>
    </div>
  );
};

export default MenuList;
