import { useQuery, useReactiveVar } from '@apollo/client';
import React, { useState } from 'react';
import { ChartTypes } from '../../constants/chartTypes';
import { GET_MONTHLY_STATS } from '../../graphql/queries/monthlyStats';
import { GET_WEEKLY_STATS } from '../../graphql/queries/weeklyStats';
import { MyStudioSlugVar } from '../../graphql/variables';
import processMonthlyStats from '../function/stats/processMonthlyStats';
import processWeeklyStats from '../function/stats/processWeeklyStats';
import './MyStudioStats.css';
import StatsChart from './StatsChart';
import StudioStatsCard from './StudioStatsCard';

const MyStudioStats = ({ isByMonth, setIsByMonth }) => {
  const slug = useReactiveVar(MyStudioSlugVar);

  const [chartType, setChartType] = useState(Object.keys(ChartTypes)[0]);
  const [stats, setStats] = useState({
    VISIT: [],
    CLICK: [],
    CONTACT: [],
  });

  const [labels, setLabels] = useState([]);

  const { loading } = useQuery(
    isByMonth ? GET_MONTHLY_STATS : GET_WEEKLY_STATS,
    {
      variables: { slug },
      notifyOnNetworkStatusChange: true,
      onCompleted: data => {
        if (isByMonth) {
          const { labels, data: contact } = processMonthlyStats(
            data.monthlyStudioContact.stats || [],
            6
          );
          const reservation = processMonthlyStats(
            data.monthlyStudioReservation.stats || [],
            6
          ).data;
          const contactData = [];
          for (let i = 0; i < 6; i++)
            contactData.push(contact[i] + reservation[i]);
          setLabels(labels);
          setStats({
            VISIT: processMonthlyStats(
              data.monthlyStudioInfoView.stats || [],
              6
            ).data,
            CLICK: processMonthlyStats(
              data.monthlyOriginalPhotoView.stats || [],
              6
            ).data,
            CONTACT: contactData,
          });
        } else {
          const { labels, data: contact } = processWeeklyStats(
            data.weeklyStudioContact.stats || [],
            12
          );
          const reservation = processWeeklyStats(
            data.weeklyStudioReservation.stats || [],
            12
          ).data;
          const contactData = [];
          for (let i = 0; i < 12; i++)
            contactData.push(contact[i] + reservation[i]);
          setLabels(labels);
          setStats({
            VISIT: processWeeklyStats(data.weeklyStudioInfoView.stats || [], 12)
              .data,
            CLICK: processWeeklyStats(
              data.weeklyOriginalPhotoView.stats || [],
              12
            ).data,
            CONTACT: contactData,
          });
        }
      },
    }
  );

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div className="durationNavigatorContainer">
        {isByMonth ? (
          <div className="durationNavigator">
            <div
              className="unselectedDurationPicker"
              onClick={() => setIsByMonth(false)}
            >
              주
            </div>
            <div className="selectedDurationPicker">월</div>
          </div>
        ) : (
          <div className="durationNavigator">
            <div className="selectedDurationPicker">주</div>
            <div
              className="unselectedDurationPicker"
              onClick={() => setIsByMonth(true)}
            >
              월
            </div>
          </div>
        )}
      </div>
      <div className="myStudioStatsTitle">나의 스튜디오</div>
      <div className="myStudioCurrentStats">
        <StudioStatsCard
          onClick={() => setChartType('VISIT')}
          title={ChartTypes.VISIT}
          description="기간 내 스튜디오 상세페이지 방문 수"
          currentData={stats.VISIT[stats.VISIT.length - 1]}
          lastData={stats.VISIT[stats.VISIT.length - 2]}
          isClickable={true}
        />
        <StudioStatsCard
          onClick={() => setChartType('CLICK')}
          title={ChartTypes.CLICK}
          description="기간 내 나의 사진 클릭 수 합계"
          currentData={stats.CLICK[stats.CLICK.length - 1]}
          lastData={stats.CLICK[stats.CLICK.length - 2]}
          isClickable={true}
        />
        <StudioStatsCard
          onClick={() => setChartType('CONTACT')}
          title={ChartTypes.CONTACT}
          description="기간 내 문의, 예약 전환 수"
          currentData={stats.CONTACT[stats.CONTACT.length - 1]}
          lastData={stats.CONTACT[stats.CONTACT.length - 2]}
          isClickable={true}
        />
      </div>
      <StatsChart
        name={ChartTypes[chartType]}
        labels={labels}
        data={stats[chartType]}
      />
    </div>
  );
};

export default MyStudioStats;
