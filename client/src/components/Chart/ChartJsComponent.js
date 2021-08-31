import React from 'react';
import { Bar } from 'react-chartjs-2';

export const ChartJsComponent = ({ histogramData }) => {

  const dataSets = Object.keys(histogramData)
    .sort((left, right) => left - right)
    .reduce((carry, key) => {
      carry.labels.push(key);
      carry.data.push(histogramData[key]);
      return carry;
    }, { labels: [], data: [] });

  const barData = {
    labels: dataSets.labels,
    datasets: [
      {
        label: 'Age buckets',
        data: dataSets.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            color: 'white',
            font: {
              color: 'white',
              size: 16
            }
          },
        },
      ],
    },
    plugins: {
      legend: {
        labels: {
          font: {
            color: 'white',
            size: 16
          }
        }
      }
    }
  };

  return (
    <div>
      <Bar
        data={barData}
        width={100}
        height={50}
        options={{ options }}
      />
    </div>
  );
};
