import React from 'react';
import './OtherStats.css';
import StudioStatsCard from './StudioStatsCard';
import {
  MONTHLY_AVERAGE_CLICK_COUNT,
  MONTHLY_AVERAGE_VISIT_COUNT,
  WEEKLY_AVERAGE_CLICK_COUNT,
  WEEKLY_AVERAGE_VISIT_COUNT,
} from '../../constants/stats';

const OtherStats = ({ isByMonth }) => (
  <div className="otherStatsContainer">
    <div className="otherStatsTitle">전체 스튜디오</div>
    <div className="otherStatsCardContainer">
      <StudioStatsCard
        title="평균 방문 수"
        description="기간 내 전체 스튜디오 상세페이지 평균 방문 수"
        currentData={
          isByMonth ? MONTHLY_AVERAGE_VISIT_COUNT : WEEKLY_AVERAGE_VISIT_COUNT
        }
        lastData={null}
        isClickable={false}
      />
      <StudioStatsCard
        title="평균 컨셉북 클릭 수"
        description="기간 내 스튜디오 별 사진 클릭 수 평균 합계"
        currentData={
          isByMonth ? MONTHLY_AVERAGE_CLICK_COUNT : WEEKLY_AVERAGE_CLICK_COUNT
        }
        lastData={null}
        isClickable={false}
      />
    </div>
  </div>
);

export default OtherStats;
