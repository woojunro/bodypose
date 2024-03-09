import React from 'react';
import { Line } from 'react-chartjs-2';

const Chart = ({ name = '', labels, data }) => (
  <Line
    options={{ maintainAspectRatio: false }}
    data={{
      labels,
      datasets: [
        {
          label: name,
          data,
          backgroundColor: 'rgba(81,100,247,0.4)',
          borderColor: 'rgba(81,100,247,1)',
          pointBackgroundColor: '#fff',
        },
      ],
    }}
  />
);

export default Chart;
