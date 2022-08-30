import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

function DoughnutChart({chartData, options}){
  return <Doughnut data={chartData} options={options} width="300" height="300" />;
}

export default DoughnutChart;