import React from 'react';
import BottomAlertDialog from '../../components/mobileComponents/BottomAlertDialog';
import './KakaoPhoneScreen.css';
import Kakao1 from '../../materials/kakao1.png';
import Kakao2 from '../../materials/kakaoPhoneNumber.jpeg';
import Kakao3 from '../../materials/kakaoPhoneNumber2.jpeg';
import ReactGA from 'react-ga';

const KakaoPhoneScreen = ({ match }) => {
  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const kakaoID = match.params.kakaoID;

  const copyTextToClipboard = () => {
    var dummy = document.createElement('input'),
      text = kakaoID;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');

    document.body.removeChild(dummy);
  };

  const CloseWindow = () => {
    window.open('', '_self').close();
  };
  return (
    <div>
      <BottomAlertDialog
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        dialog="아이디가 복사되었습니다."
      />
      <div className="kakaoHeader">
        <div onClick={() => CloseWindow()}>창닫기</div>
      </div>
      <div className="kakaoIDText">연락처</div>
      <div className="copyKakaoId">
        <div>{kakaoID}</div>
        <div
          onClick={() => {
            copyTextToClipboard();
            setIsAlertOpen(true);
          }}
          className="copyIDTab"
        >
          복사하기
        </div>
      </div>
      <div className="kakaoDescription">
        1. 위의 복사하기를 누른 후, 카카오톡 친구 추가를 눌러주세요.
      </div>
      <div className="kakaoPhotos">
        <img src={Kakao1} alt="카카오톡에 들어가세요" />
      </div>

      <div className="kakaoDescription">2. 연락처로 추가를 눌러주세요.</div>
      <div className="kakaoPhotos">
        <img src={Kakao2} alt="카카오톡에 들어가세요" />
      </div>
      <div className="kakaoDescription">3. 복사한 연락처를 추가해주세요.</div>
      <div className="kakaoPhotos">
        <img src={Kakao3} alt="카카오톡에 들어가세요" />
      </div>
    </div>
  );
};

export default KakaoPhoneScreen;
