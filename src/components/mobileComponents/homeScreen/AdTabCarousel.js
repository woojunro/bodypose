import React from 'react';
import { HOMESCREEN_AD_URL } from '../../../constants/urls';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './AdTabCarousel.css';
import { useHistory } from 'react-router';

const AdTap = () => {
  const history = useHistory();
  const adTabitems = HOMESCREEN_AD_URL.map(item => {
    return (
      <div key={item.url} className="adTap">
        <img
          className="appAdTap"
          alt="바디프로필의 모든 정보 바디포즈"
          src={item.url}
          onClick={
            item.link
              ? () => {
                  window.open(item.link, '_blank');
                }
              : null
          }
        />
      </div>
    );
  });

  const renderedAdTab = () => {
    if (HOMESCREEN_AD_URL.length === 1) {
      return (
        <div className="adTap">
          <img
            className="appAdTap"
            alt="바디프로필의 모든 정보 바디포즈"
            src={HOMESCREEN_AD_URL[0].url}
            onClick={
              HOMESCREEN_AD_URL[0].link
                ? () => {
                    window.open(HOMESCREEN_AD_URL[0].link, '_blank');
                  }
                : null
            }
          />
        </div>
      );
    } else {
      return (
        <Carousel
          className="adTap"
          autoPlay={true}
          infiniteLoop={true}
          showStatus={false}
          showThumbs={false}
          interval={5000}
          showArrows={false}
          //링크 바디포즈로 시작하면 현재창에서 열고 아니면 외부에서 열기
          onClickItem={(index, item) => {
            HOMESCREEN_AD_URL[index].link.startsWith('http')
              ? window.open(HOMESCREEN_AD_URL[index].link, '_blank')
              : history.push(HOMESCREEN_AD_URL[index].link);
          }}
        >
          {adTabitems}
        </Carousel>
      );
    }
  };
  return <>{renderedAdTab()}</>;
};

export default AdTap;
