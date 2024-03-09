import React, { useState } from 'react';
import useMyInfo from '../hooks/useMyInfo';
import PageTitle from '../components/PageTitle';
import MyGeneralInfo from '../components/Info/MyGeneralInfo';
import InfoChangeButton from '../components/Info/InfoChangeButton';
import MessageInfo from '../components/Info/MessageInfo';
import Footer from '../components/Footer';
import NoticeMent from '../components/NoticeMent';
import autoHyphenPhoneNumber from '../components/function/autoHyphenPhoneNumber';
import { gql, useMutation } from '@apollo/client';
import { validatePhoneNumber } from '../components/function/validations';
import {
  ERROR_MESSAGE,
  INVALID_PHONE_NUMBER,
} from '../constants/errorMessages';
import { CONFIRM_INFO_UPDATE } from '../constants/messages';
import useRefresh from '../hooks/useRefresh';

const UPDATE_MY_INFO = gql`
  mutation UpdateMyInfo($payload: UpdatePartnerPayload!) {
    updatePartner(input: { payload: $payload }) {
      ok
      error
    }
  }
`;

const MyInfoScreen = () => {
  const {
    info: { emailAgreedAt, smsAgreedAt },
    refetch,
  } = useMyInfo();

  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [smsRecieve, setSmsRecieve] = useState(Boolean(smsAgreedAt));
  const [emailRecieve, setEmailRecieve] = useState(Boolean(emailAgreedAt));

  const [updateMyInfo, { loading }] = useMutation(UPDATE_MY_INFO, {
    onCompleted: async data => {
      if (data.updatePartner.ok) {
        await refetch();
        refresh();
      } else alert(ERROR_MESSAGE);
    },
    onError: () => alert(ERROR_MESSAGE),
  });

  const setHyphenedPhoneNumber = phoneNumber => {
    const hyphened = autoHyphenPhoneNumber(phoneNumber);
    setNewPhoneNumber(hyphened);
  };

  // 적용하기 눌렀을 때 저장하기
  const saveData = () => {
    const willBeChanged = [];
    const payload = {};

    // 휴대전화 변경
    if (newPhoneNumber) {
      const valid = validatePhoneNumber(newPhoneNumber);
      if (!valid) {
        alert(INVALID_PHONE_NUMBER);
        return;
      }
      payload.phoneNumber = newPhoneNumber;
      willBeChanged.push('휴대전화');
    }

    // 수신 여부 변경 확인
    const shouldChangeSms = smsRecieve !== Boolean(smsAgreedAt);
    const shouldChangeEmail = emailRecieve !== Boolean(emailAgreedAt);

    if (shouldChangeSms) willBeChanged.push('SMS 수신여부');
    if (shouldChangeEmail) willBeChanged.push('이메일 수신여부');

    if (willBeChanged.length === 0) return;
    const willBeChangedToString = willBeChanged.join(', ');
    const ok = window.confirm(CONFIRM_INFO_UPDATE(willBeChangedToString));
    if (!ok) return;

    // Update
    const updateDatetime = new Date(Date.now());
    if (shouldChangeSms) {
      payload.smsAgreedAt = smsRecieve ? updateDatetime : null;
    }
    if (shouldChangeEmail) {
      payload.emailAgreedAt = emailRecieve ? updateDatetime : null;
    }

    updateMyInfo({ variables: { payload } });
  };

  const refresh = useRefresh();

  return (
    <div>
      <div className="Dashboard">
        <div className="partnersMainPartContainer">
          <div className="partnersMainPart">
            <PageTitle title="내 정보 관리" />
            <MyGeneralInfo
              newPhoneNumber={newPhoneNumber}
              setNewPhoneNumber={setHyphenedPhoneNumber}
            />
            <MessageInfo
              smsRecieve={smsRecieve}
              setSmsRecieve={setSmsRecieve}
              emailRecieve={emailRecieve}
              setEmailRecieve={setEmailRecieve}
            />
            <NoticeMent />
            <InfoChangeButton
              refresh={refresh}
              onClick={saveData}
              isActive={!loading}
            />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfoScreen;
