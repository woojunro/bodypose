import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LoginScreen.css';
import logo from '../../materials/partners.png';
import InputForm from '../../components/Auth/InputForm';
import LoginButton from '../../components/Auth/LoginButton';
import Header from '../../components/Header';
import LoginOptionButton from '../../components/Auth/LoginOptionButton';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import API_URLS from '../../constants/urls';
import styled from 'styled-components';
import { openBodyposeContact } from '../../components/function/openInNewTab';
import { BsDownload } from 'react-icons/bs';
const Link = styled.div`
  font-size: 16px;
  text-decoration: underline;
  color: gray;
  cursor: pointer;
`;

const MarginDiv = styled.div`
  margin-top: 20px;
`;

const LinkToContact = () => (
  <Link onClick={openBodyposeContact}>바디포즈 고객센터</Link>
);

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validInfo, setValidInfo] = useState(true);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [findModalOpen, setFindModalOpen] = useState(false);
  const [checkingModalOpen, setCheckingModalOpen] = useState(false);

  const openFindModal = () => setFindModalOpen(true);
  const closeFindModal = () => setFindModalOpen(false);

  const openCheckingModal = () => setCheckingModalOpen(true);
  const closeCheckingModal = () => setCheckingModalOpen(false);

  // 로그인 function
  const loginFunction = async () => {
    setLoading(true);
    setValidInfo(true);
    const payload = { email, password };
    try {
      const res = await axios.post(API_URLS.PARTNERS_LOGIN, payload);
      if (res.data.access && res.data.refresh) {
        window.location.reload();
      } else {
        throw new Error('Login failed by an unexpected error');
      }
    } catch (e) {
      if (e.response?.status === 403) {
        openCheckingModal();
      } else {
        setValidInfo(false);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="loginScreen">
        <div className="loginScreenContainer">
          <div className="loginLogo">
            <img alt="logo" src={logo} />
          </div>
          <div className="loginDescription">
            <div> 바디포즈 파트너스에 등록한 이메일로 로그인해 주세요.</div>
            <div>
              <span>처음 방문하신 분은 </span>
              <span
                style={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  color: 'black',
                }}
                onClick={() => {
                  history.push({ pathname: '/join' });
                }}
              >
                회원가입
              </span>
              <span> 후, 이용해 주세요.</span>
            </div>
          </div>
          <div className="loginBox">
            <InputForm
              onInputSubmit={setEmail}
              placeholder="이메일"
              type="text"
            />
            <InputForm
              onInputSubmit={setPassword}
              placeholder="비밀번호"
              type="password"
            />
          </div>
          {validInfo ? null : (
            <div className="noIDPassword">
              이메일 혹은 비밀번호를 다시 한 번 확인해주세요.
            </div>
          )}
          <LoginButton loginFunction={loginFunction} disabled={loading} />
          <div className="loginOptionButtons">
            <LoginOptionButton
              onClick={() => history.push({ pathname: '/join' })}
              optionName="회원가입"
            />
            <span style={{ marginLeft: '5px', marginRight: '-4px' }}>|</span>
            <LoginOptionButton
              optionName="이메일/비밀번호 찾기"
              onClick={openFindModal}
            />
            <span style={{ marginLeft: '5px', marginRight: '-4px' }}>|</span>
            <LoginOptionButton
              optionName="고객센터"
              onClick={openBodyposeContact}
            />
            <button
              className="service-download"
              onClick={() => {
                window.open(
                  'https://docs.google.com/uc?export=download&id=1MNJjlKw-rWxhZd0a4jlKNX1au3WMGLKb',
                  '_blank'
                );
              }}
            >
              서비스 소개서
              <BsDownload className="service-download-button" />
            </button>
            <Modal open={findModalOpen} onClose={closeFindModal} center>
              <div className="findIdModal">
                <div className="findIdTitle">
                  이메일 혹은 비밀번호를 잊으셨나요?
                </div>
                <div className="findIdText">
                  <div>
                    회원님의 안전한 정보 관리를 위하여 이메일 및 비밀번호를
                    분실하신 경우
                  </div>
                  <div>고객센터로 문의 주시기 바랍니다.</div>
                </div>
                <LinkToContact />
                <div className="findIdConfirmButton" onClick={closeFindModal}>
                  확인
                </div>
              </div>
            </Modal>
            <Modal open={checkingModalOpen} onClose={closeCheckingModal} center>
              <div className="findIdModal">
                <div className="findIdText">
                  <MarginDiv>
                    스튜디오 정보를 확인 중입니다. 가입 승인 후 로그인
                    가능합니다.
                  </MarginDiv>
                  <div>자세한 사항은 고객센터로 문의 주시기 바랍니다.</div>
                </div>
                <LinkToContact />
                <div
                  className="findIdConfirmButton"
                  onClick={closeCheckingModal}
                >
                  확인
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;
