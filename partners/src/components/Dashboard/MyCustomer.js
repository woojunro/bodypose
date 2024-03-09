import { React, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useReactiveVar } from '@apollo/client';
import { ChartTypes } from '../../constants/chartTypes';
import { LoggedInPaths } from '../../routers/LoggedInRouter';
import processWeeklyStats from '../function/stats/processWeeklyStats';
import Chart from './chart';
import './MyCustomer.css';
import { MyStudioSlugVar } from '../../graphql/variables';
import DashboardLoading from './DashboardLoading';
import { GET_WEEKLY_STATS } from '../../graphql/queries/weeklyStats';

const MyCustomer = () => {
  const history = useHistory();
  const slug = useReactiveVar(MyStudioSlugVar);

  const [chartType, setChartType] = useState(Object.keys(ChartTypes)[0]);
  const [stats, setStats] = useState({
    VISIT: [],
    CLICK: [],
    CONTACT: [],
  });

  const { loading } = useQuery(GET_WEEKLY_STATS, {
    variables: { slug },
    onCompleted: data => {
      const contact = processWeeklyStats(
        data.weeklyStudioContact.stats || [],
        5
      ).data;
      const reservation = processWeeklyStats(
        data.weeklyStudioReservation.stats || [],
        5
      ).data;
      const contactData = [];
      for (let i = 0; i < 5; i++) contactData.push(contact[i] + reservation[i]);
      setStats({
        VISIT: processWeeklyStats(data.weeklyStudioInfoView.stats || [], 5)
          .data,
        CLICK: processWeeklyStats(data.weeklyOriginalPhotoView.stats || [], 5)
          .data,
        CONTACT: contactData,
      });
    },
  });

  const labels = ['5주전', '4주전', '3주전', '2주전', '1주전'];

  return (
    <div className="dashboardMyCustomerContainer">
      <div className="mycustomerTitleContainer">
        <div className="mycustomerTitle">
          고객현황
          <div className="mycustomerUpdateText">매주 월요일 업데이트</div>
        </div>
        <div
          className="showstatsText"
          onClick={() => history.push(LoggedInPaths.STATISTICS)}
        >
          통계보기
        </div>
      </div>
      {loading ? (
        <DashboardLoading />
      ) : (
        <div className="mycustomerDataContainer">
          <div className="mycustomerStat">
            {Object.keys(ChartTypes).map(key => (
              <div
                key={key}
                className="mycustomerStatLine"
                onClick={() => setChartType(key)}
              >
                <div className="mycustomerStatTitle">{ChartTypes[key]}</div>
                <div className="mycustomerNumber">
                  {stats[key][stats[key].length - 1]}
                  <span className="mycustomerNumberText">회</span>
                </div>
              </div>
            ))}
          </div>
          <div className="myCustomerChart">
            <Chart
              name={ChartTypes[chartType]}
              labels={labels}
              data={stats[chartType]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCustomer;
