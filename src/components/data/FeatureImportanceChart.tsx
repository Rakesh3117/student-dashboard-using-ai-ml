import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatPercent } from '../../lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FeatureImportanceChartProps {
  featureImportance: Record<string, number>;
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ featureImportance }) => {
  const featureLabels = {
    studyHours: 'Study Hours',
    previousScore: 'Previous Scores',
    attendance: 'Attendance',
    difficulty: 'Course Difficulty',
    internetAccess: 'Internet Access',
  };

  const data = {
    labels: Object.keys(featureImportance).map(key => featureLabels[key as keyof typeof featureLabels] || key),
    datasets: [
      {
        label: 'Feature Importance',
        data: Object.values(featureImportance),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // blue
          'rgba(16, 185, 129, 0.7)', // green
          'rgba(249, 115, 22, 0.7)', // orange
          'rgba(239, 68, 68, 0.7)',  // red
          'rgba(139, 92, 246, 0.7)', // purple
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(249, 115, 22)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return formatPercent(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...Object.values(featureImportance)) * 1.1,
        ticks: {
          callback: function(value: any) {
            return formatPercent(value);
          }
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default FeatureImportanceChart;