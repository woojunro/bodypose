import React, { useState } from 'react';
import './MyGeneralInfo.css';
import '../../Maincss.css';
import GeneralInfoItem from './GeneralInfoItem';
import ChangeInfoInput from '../Info/ChangeInfoInput';
import { useHistory } from 'react-router-dom';
import useMyInfo from '../../hooks/useMyInfo';
import { LoggedInPaths as Paths } from '../../routers/LoggedInRouter';

const GeneralInfo = ({ newPhoneNumber, setNewPhoneNumber }) => {
  const { info } = useMyInfo();
  const [isPhoneNumberOpen, setIsPhoneNumberOpen] = useState(false);
  const history = useHistory();

  return (
    <>
      <div className="fullSizeBox">
        <div className="boxTitle">기본 정보</div>
        <div className="generalInfoContainer">
          <GeneralInfoItem title="이메일" item={info.email} />
          <GeneralInfoItem
            title="비밀번호"
            item="********"
            changeText="비밀번호 변경하기"
            onClick={() => history.push(Paths.CHANGE_PASSWORD)}
          />
          <GeneralInfoItem
            title="휴대전화"
            item={info.phoneNumber}
            changeText={isPhoneNumberOpen ? '취소' : '번호 변경하기'}
            onClick={() => {
              if (isPhoneNumberOpen) setNewPhoneNumber('');
              setIsPhoneNumberOpen(!isPhoneNumberOpen);
            }}
          />
          {isPhoneNumberOpen && (
            <ChangeInfoInput
              value={newPhoneNumber}
              onChange={setNewPhoneNumber}
              placeholder="변경할 휴대전화 번호"
              maxLength={13}
            />
          )}
          <GeneralInfoItem
            title="사업자 등록 번호"
            item={info.businessNumber}
          />
        </div>
      </div>
    </>
  );
};

export default GeneralInfo;
