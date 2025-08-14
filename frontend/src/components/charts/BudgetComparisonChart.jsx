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

// Register the components Chart.js needs
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BudgetComparisonChart = ({ data }) => {
    if (!Array.isArray(data)) {
        return <div>Loading chart...</div>;
    }

    const filteredData = data.filter(item => item.budgeted > 0 || item.spent > 0);

    if (filteredData.length === 0) {
        return (
            <div className="bg-theme-surface p-6 rounded-2xl shadow-md mt-6">
                <h2 className="text-xl font-bold mb-4 text-theme-text-primary">Budget vs. Spending</h2>
                <p className="text-theme-text-secondary">Set a budget or add an expense to see your comparison chart.</p>
            </div>
        );
    }
    
    // ✅ Prepare data in the format Chart.js expects
    const chartData = {
        labels: filteredData.map(item => item.name),
        datasets: [
            {
                label: 'Budgeted',
                data: filteredData.map(item => item.budgeted),
                backgroundColor: '#a0aec0', // A nice gray color
                borderRadius: 4,
            },
            {
                label: 'Spent',
                data: filteredData.map(item => item.spent),
                backgroundColor: 'var(--primary-color)', // Your theme's primary color
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false, // We have our own title
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="bg-theme-surface p-6 rounded-2xl shadow-md mt-6">
            <h2 className="text-xl font-bold mb-4 text-theme-text-primary">Budget vs. Spending</h2>
            {/* ✅ Render the Bar component from react-chartjs-2 */}
            <Bar options={options} data={chartData} />
        </div>
    );
};

export default BudgetComparisonChart;