import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarData {
  name: string;
  meta: number;
  gasto: number;
}

interface BarChartProps {
  data: BarData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const labels = data.map(item => item.name);
  const metas = data.map(item => item.meta);
  const gastos = data.map(item => item.gasto);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Metas',
        data: metas,
        backgroundColor: 'rgba(255, 165, 0, 0.8)', 
        borderColor: 'rgba(255, 165, 0, 1)',
        borderWidth: 1,
        borderRadius: 3, 
        barThickness: 20, 
      },
      {
          label: 'Gastos',
          data: gastos,
          backgroundColor: 'rgba(255, 0, 0, 0.8)', 
          borderColor: 'rgba(255, 0, 0, 1)', 
          borderWidth: 1,
          borderRadius: 3, 
          barThickness: 20, 
          stack: 'Stack 1',
        },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          boxWidth: 15,
          padding: 10,
        },
      },
    },
    layout: {
      padding: {
        bottom: 20,  
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false, 
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
