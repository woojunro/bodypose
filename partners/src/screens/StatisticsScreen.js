import React from 'react';
import './StatisticsScreen.css';
import StatsTitle from '../components/StatsScreen/StatsTitle';
import StatsMain from '../components/StatsScreen/StatsMain';
import Footer from '../components/Footer';

const StatisticsScreen = () => {
  return (
    <div>
      <div className="Dashboard">
        <div className="partnersMainPartContainer">
          <div className="statisticsScreen">
            <StatsTitle />
            <StatsMain />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsScreen;
