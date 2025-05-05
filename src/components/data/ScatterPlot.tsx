import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface ScatterPlotProps {
  data: Array<{ x: number; y: number }>;
  xLabel: string;
  yLabel: string;
  title?: string;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  xLabel,
  yLabel,
  title,
}) => {
  const chartData = {
    datasets: [
      {
        label: title || 'Scatter Plot',
        data: data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: xLabel,
        },
      },
      y: {
        title: {
          display: true,
          text: yLabel,
        },
      },
    },
    plugins: {
      legend: {
        display: title ? true : false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${yLabel}: ${context.parsed.y}, ${xLabel}: ${context.parsed.x}`;
          },
        },
      },
    },
  };

  return <Scatter data={chartData} options={options} />;
};

export default ScatterPlot;