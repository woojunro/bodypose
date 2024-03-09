import React from 'react';
import './ShopInformation.css';
import { IoMdArrowRoundForward } from 'react-icons/io';
import openInNewTab from '../function/openInNewTab';

const ShopInformation = ({ information }) => {
  return (
    <>
      <span className="hairshopName">
        <b>{information.name}</b>
      </span>
      {information.type === 'VISIT' && (
        <span className="goOut">(출장 헤어/메이크업)</span>
      )}
      {information.type === 'OWNED' && (
        <span className="goOut">(자체 헤어/메이크업)</span>
      )}
      {information.contactInfo &&
        (information.contactInfo.startsWith('http') ? (
          <div
            className="hairshopLink"
            onClick={() => openInNewTab(information.contactInfo)}
          >
            <div className="hairshopContact">헤어샵 정보 보기</div>
            <IoMdArrowRoundForward className="harishopArrow" size="13px" />
          </div>
        ) : (
          <div className="hairshopContact">{information.contactInfo}</div>
        ))}
      {information.address && (
        <div className="hairshopAdress">주소 : {information.address}</div>
      )}
    </>
  );
};

export default ShopInformation;
