import React from 'react';
import './StatsNavigator.css';

const StatsNavigator = ({ currentPick, setCurrentPick }) => {
  return currentPick === 'studio' ? (
    <div className="statsNavigatorContainer">
      <div className="statsNavigator">
        <div className="navigatorLeftBox" />
        <div className="selectedStats">스튜디오 통계</div>
        <div
          className="unselectedStats"
          onClick={() => setCurrentPick('photo')}
        >
          사진 통계
        </div>
      </div>
      <div className="navigatorRightBox" />
    </div>
  ) : (
    <div className="statsNavigatorContainer">
      <div className="statsNavigator">
        <div className="navigatorLeftBox" />
        <div
          className="unselectedStats"
          onClick={() => setCurrentPick('studio')}
        >
          스튜디오 통계
        </div>
        <div className="selectedStats">사진 통계</div>
      </div>
      <div className="navigatorRightBox" />
    </div>
  );
};

export default StatsNavigator;
