import React from 'react';
import { Flex, useColorModeValue } from '@chakra-ui/react';
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
import formatMoneyValue from '../../../utils/formatMoneyValue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const image = new Image();
image.src = 'https://www.chartjs.org/img/chartjs-logo.svg';

const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
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

  const gridColors = useColorModeValue('#F5F5F5', '#616161');

  const options = {
    plugins: {
      title: {
        display: false,
        text: 'Monthly Revenue'
      },
      legend: {
        position: 'bottom'
      },
      customCanvasBackgroundColor: {
        color: 'lightgreen'
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        grid: {
          display: true,
          color: gridColors
        },
        ticks: {
          callback: function (value, index, ticks) {
            return '$' + value;
          }
        }
      }
    }
  };

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
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
        borderRadius: 5
      },
      {
        label: lastYear,
        data: labels.map((label, index) =>
          monthlyGraphRevenueDataSet02 ? monthlyGraphRevenueDataSet02[index]?.month_total : 0
        ),
        borderColor: 'rgba(255, 99, 132, .7)',
        backgroundColor: 'rgba(255, 99, 132, 0.8',
        borderRadius: 5
      },
      {
        label: twoYearsAgo,
        data: labels.map((label, index) =>
          monthlyGraphRevenueDataSet03 ? monthlyGraphRevenueDataSet03[index]?.month_total : 0
        ),
        borderColor: 'rgba(43, 166, 37, 0.7)',
        backgroundColor: 'rgba(59, 225, 51, 0.8)',
        borderRadius: 5
      }
    ]
  };

  return (
    <>
      <Flex w={'full'} justifyContent={'center'} my={'auto'}>
        <Bar data={data} options={options} />
      </Flex>
    </>
  );
};

export default MonthlyRevenueStackedChart;
