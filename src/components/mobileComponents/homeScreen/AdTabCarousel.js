import React from 'react';
import { HOMESCREEN_AD_URL } from '../../../constants/urls';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './AdTabCarousel.css';

const AdTap = () => {
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
            className="ad"
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
          autoPlay={true}
          infiniteLoop={true}
          showStatus={false}
          showThumbs={false}
          interval={5000}
          showArrows={false}
        >
          {adTabitems}
        </Carousel>
      );
    }
  };
  return <>{renderedAdTab()}</>;
};

export default AdTap;
