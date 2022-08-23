import React from 'react';
import {Line} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

function LineChart({chartData, options}){
  return <Line data={chartData} options={options} width="300" height="300" />;
}

export default LineChart;