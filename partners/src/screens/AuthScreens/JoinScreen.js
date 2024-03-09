import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import logo from '../../materials/partners.png';
import JoinInput from '../../components/Auth/JoinInput';
import {
  CheckValidEmail,
  CheckValidPassword,
  CheckValidStudioName,
} from '../../components/function/Auth/LoginFunctions';
import './JoinScreen.css';
import JoinButton from '../../components/Auth/JoinButton';
import { gql, useMutation } from '@apollo/client';
import autoHyphenPhoneNumber from '../../components/function/autoHyphenPhoneNumber';
import autoHyphenBusinessNumber from '../../components/function/autoHyphenBusinessNumber';
import { ERROR_MESSAGE } from '../../constants/errorMessages';
import { NOTICE_URL, PRIVACY_URL } from '../../constants/urls';

const CREATE_PARTNER = gql`
  mutation CreatePartner($payload: CreatePartnerInput!) {
    createPartner(input: $payload) {
      ok
      error
    }
  }
`;

const SigninScreen = () => {
  const history = useHistory();

  const [studioName, setStudioName] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [businessNumber, setBusinessNumber] = useState('');

  const [someError, setSomeError] = useState(true);

  const [isEmailAlreadyUsed, setIsEmailAlreadyUsed] = useState(false);

  const [createPartner, { loading }] = useMutation(CREATE_PARTNER, {
    onCompleted: data => {
      const { ok, error } = data.createPartner;
      if (ok) {
        alert('회원가입 신청이 완료되었습니다.');
        history.push('/');
      } else {
        if (error === 'DUPLICATE_EMAIL') {
          setIsEmailAlreadyUsed(true);
        } else {
          alert(ERROR_MESSAGE);
        }
      }
    },
    onError: () => alert(ERROR_MESSAGE),
  });

  const onClickSubmit = () => {
    const payload = {
      email,
      password,
      name,
      phoneNumber,
      instagram: url,
      businessNumber,
      reqStudioName: studioName,
    };

    createPartner({
      variables: { payload },
    });
  };

  useEffect(() => {
    if (
      CheckValidEmail(email) &&
      CheckValidPassword(password) &&
      password === checkPassword &&
      CheckValidStudioName(studioName) &&
      checked &&
      studioName !== '' &&
      url !== '' &&
      phoneNumber !== '' &&
      businessNumber !== ''
    ) {
      setSomeError(false);
    } else {
      setSomeError(true);
    }
  }, [
    email,
    password,
    checkPassword,
    name,
    checked,
    businessNumber,
    phoneNumber,
    studioName,
    url,
  ]);

  useEffect(() => {
    setPhoneNumber(autoHyphenPhoneNumber(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    setBusinessNumber(autoHyphenBusinessNumber(businessNumber));
  }, [businessNumber]);

  return (
    <div>
      <Header />
      <div className="joinScreenContainer">
        <div className="joinScreen">
          <div className="joinLogo">
            <img alt="logo" src={logo} />
          </div>
          <div className="joinInformationConainer">
            <div>
              <div className="joinDescription">
                <div>
                  바디포즈는 바디프로필 스튜디오의 가입만 받고 있습니다.
                </div>
                <div>
                  회원가입을 완료하시면, 바디프로필 취급 여부를 확인하고 빠르게
                  연락 드리겠습니다.
                </div>
              </div>
              <JoinInput
                title="아이디"
                description="(이메일)"
                value={email}
                onInputSubmit={setEmail}
                placeholder="example@abc.com"
              />
              {email !== '' && !CheckValidEmail(email) && (
                <div className="passwordWarning">잘못된 이메일 형식입니다.</div>
              )}
              {isEmailAlreadyUsed && (
                <div className="passwordWarning">
                  이미 사용중인 이메일입니다.
                </div>
              )}
              <JoinInput
                title="비밀번호"
                value={password}
                onInputSubmit={setPassword}
                placeholder="비밀번호 (영문/숫자/특수문자)"
                description="(8자 이상)"
                type="password"
              />
              {password.length > 7 || password === '' ? (
                password !== '' &&
                !CheckValidPassword(password) && (
                  <div className="passwordWarning">
                    영문 소문자와 숫자를 각각 하나 이상 사용해주세요.
                  </div>
                )
              ) : (
                <div className="passwordWarning">비밀번호가 너무 짧습니다.</div>
              )}
              <JoinInput
                title="비밀번호 확인"
                value={checkPassword}
                onInputSubmit={setCheckPassword}
                placeholder="비밀번호 다시 입력"
                type="password"
              />
              {password !== checkPassword && (
                <div className="passwordWarning">
                  <div>비밀번호가 다릅니다.</div>
                </div>
              )}
              <JoinInput
                title="담당자 이름"
                value={name}
                onInputSubmit={setName}
                placeholder="이름"
              />
              <JoinInput
                title="연락처"
                description="(연락 받으실 연락처를 입력해주세요)"
                value={phoneNumber}
                onInputSubmit={setPhoneNumber}
                placeholder="010-xxxx-xxxx"
              />
              <JoinInput
                title="스튜디오 이름"
                description="(공백 없이 15글자 이하)"
                value={studioName}
                onInputSubmit={setStudioName}
                placeholder="스튜디오 이름"
              />
              {!(
                /^[0-9a-zA-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\s]+$/.test(studioName) ||
                studioName === ''
              ) && (
                <div className="passwordWarning">
                  스튜디오 이름은 한글/영어/숫자만 포함할 수 있습니다.
                </div>
              )}
              {studioName.length > 15 && (
                <div className="passwordWarning">
                  스튜디오 이름은 15글자까지 설정할 수 있습니다.
                </div>
              )}
              <JoinInput
                title="스튜디오 인스타그램 아이디"
                description="바디프로필 촬영 확인용"
                value={url}
                onInputSubmit={setUrl}
                placeholder="예) @bodypose.official"
              />
              <JoinInput
                title="사업자등록번호"
                description="사업자 등록된 스튜디오만 입점 가능합니다."
                value={businessNumber}
                onInputSubmit={setBusinessNumber}
                placeholder="사업자등록번호"
              />
            </div>
          </div>
          <div className="agreeContainer">
            <input type="checkBox" onChange={() => setChecked(!checked)} />
            <span className="mustText">[필수]</span>
            <span
              onClick={() => window.open(NOTICE_URL, '_blank', 'noopener')}
              className="linkText"
            >
              서비스이용약관
            </span>
            ,
            <span
              onClick={() => window.open(PRIVACY_URL, '_blank', 'noopener')}
              className="linkText"
            >
              개인정보처리방침
            </span>
            <span>에 동의합니다.</span>
          </div>
          <div className="joinButtonContainer">
            <JoinButton
              onClickSubmit={onClickSubmit}
              usealbe={!(someError || loading)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninScreen;
