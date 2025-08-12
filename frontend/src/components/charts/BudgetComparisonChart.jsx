import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BudgetComparisonChart = ({ budgets, spendingMap }) => {
    // We only want to show categories that actually have a budget set
    const labels = Object.keys(budgets).filter(label => budgets[label] > 0);
    const budgetData = labels.map(label => budgets[label] || 0);
    const spendingData = labels.map(label => spendingMap[label] || 0);

    const data = {
        labels,
        datasets: [
            {
                label: 'Budget',
                data: budgetData,
                backgroundColor: 'rgba(91, 192, 222, 0.6)', // A light blue
                borderColor: 'rgba(91, 192, 222, 1)',
                borderWidth: 1,
            },
            {
                label: 'Actual Spending',
                data: spendingData,
                backgroundColor: 'rgba(217, 83, 79, 0.6)', // theme-accent-red
                borderColor: 'rgba(217, 83, 79, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Budget vs. Actual Spending' }
        }
    };

    // Don't render the chart if there's no data to show
    if (labels.length === 0) {
        return null;
    }

    return (
        <div className="bg-theme-surface p-6 rounded-2xl shadow-md mt-8">
            <div className="h-72">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default BudgetComparisonChart;