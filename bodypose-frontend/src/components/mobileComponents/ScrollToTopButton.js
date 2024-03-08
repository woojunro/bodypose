import React from 'react';
import './ScrollToTopButton.css';
import Top from '../../materials/icons/up-arrow.png';

const ScrollToTopButton = () => (
  <div className="scrollToTopButtonContainer">
    <div className="scrollToTopButton" onClick={() => window.scrollTo(0, 0)}>
      <img src={Top} alt="맨위로" />
      <p>
        <b>TOP</b>
      </p>
    </div>
  </div>
);

export default ScrollToTopButton;
