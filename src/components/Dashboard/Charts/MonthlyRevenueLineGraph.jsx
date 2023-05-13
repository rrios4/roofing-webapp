import React from 'react';
import { Flex } from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: false,
      text: 'Monthly Revenue'
    }
  }
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MonthlyRevenueLineGraph = (props) => {
  const {
    currentYear,
    lastYear,
    twoYearsAgo,
    monthlyGraphRevenueDataSet01,
    monthlyGraphRevenueDataSet02,
    monthlyGraphRevenueDataSet03
  } = props;

  // Dataset to plot into line graph
  const data = {
    labels,
    datasets: [
      {
        label: currentYear,
        data: labels.map((label, index) =>
          monthlyGraphRevenueDataSet01 ? monthlyGraphRevenueDataSet01[index]?.month_total : 0
        ),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.3)'
      },
      {
        label: lastYear,
        data: labels.map((label, index) =>
          monthlyGraphRevenueDataSet02 ? monthlyGraphRevenueDataSet02[index]?.month_total : 0
        ),
        borderColor: 'rgba(255, 99, 132, .7)',
        backgroundColor: 'rgba(255, 99, 132, 0.3'
      },
      {
        label: twoYearsAgo,
        data: labels.map((label, index) =>
          monthlyGraphRevenueDataSet03 ? monthlyGraphRevenueDataSet03[index]?.month_total : 0
        ),
        borderColor: 'rgba(43, 166, 37, 0.7)',
        backgroundColor: 'rgba(59, 225, 51, 0.3)'
      }
    ]
  };
  return (
    <>
      <Flex justifyContent={'center'} my={'auto'} px={'1rem'}>
        <Line options={options} data={data} />
      </Flex>
    </>
  );
};

export default MonthlyRevenueLineGraph;
