import React from 'react';
import './StatsChart.css';
import { Line } from 'react-chartjs-2';

const StatsChart = ({ name = '', labels = [], data = [] }) => (
  <div className="statsChartContainer">
    <div className="statsChart">
      <Line
        options={{ maintainAspectRatio: false }}
        data={{
          labels,
          datasets: [
            {
              label: name,
              data: data,
              backgroundColor: 'rgba(81,100,247,0.4)',
              borderColor: 'rgba(81,100,247,1)',
              pointBackgroundColor: '#fff',
            },
          ],
        }}
      />
    </div>
  </div>
);

export default StatsChart;
