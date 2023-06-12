import React from 'react';
import { Flex } from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options2 = {
  plugins: {
    title: {
      display: false,
      text: 'Monthly Revenue'
    },
    legend: {
      position: 'bottom'
    }
  },
  responsive: true,
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
};

const MonthlyRevenueStackedChart = (props) => {
  const {
    currentYear,
    lastYear,
    twoYearsAgo,
    monthlyGraphRevenueDataSet01,
    monthlyGraphRevenueDataSet02,
    monthlyGraphRevenueDataSet03
  } = props;

  const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

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
      <Flex w={'full'} justifyContent={'center'} my={'auto'} px={'2'}>
        <Bar data={data} options={options2} />
      </Flex>
    </>
  );
};

export default MonthlyRevenueStackedChart;
