import React from 'react';
import { HOMESCREEN_AD_URL } from '../../../constants/urls';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './AdTabCarousel.css';

const AdTap = () => {
  const adTabitems = HOMESCREEN_AD_URL.map((url) => {
    return (
      <div key={url} className="adTap">
        <img alt="바디프로필의 모든 정보 바디포즈" src={url} />
      </div>
    );
  });

  const renderedAdTab = () => {
    if (HOMESCREEN_AD_URL.length === 1) {
      return (
        <div className="adTap">
          <img
            alt="바디프로필의 모든 정보 바디포즈"
            src={HOMESCREEN_AD_URL[0]}
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
