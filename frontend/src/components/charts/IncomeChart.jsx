import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
// ✅ Imports the official list from your central file
import { incomeCategories } from '../../utils/categories';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const IncomeChart = ({ transactions }) => {
    
    const relevantTransactions = transactions.filter(t => t.type === 'income' && incomeCategories.includes(t.category));

    if (relevantTransactions.length === 0) {
        return (
            <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold text-theme-text-primary text-center mb-4">
                    Income Breakdown
                </h2>
                <div className="text-center text-theme-text-secondary py-10">
                    No income data to display.
                </div>
            </div>
        );
    }

    const data = {
        labels: incomeCategories,
        datasets: [{
            label: 'Income by Category',
            data: incomeCategories.map(cat => 
                transactions
                    .filter(t => t.category === cat && t.type === 'income')
                    .reduce((acc, t) => acc + t.amount, 0)
            ),
            // ✅ Colors for all 7 income categories
            backgroundColor: [
                '#4CAF50', // Green for Salary
                '#E91E63', // Pink for Bonus
                '#00BCD4', // Cyan for Freelance
                '#FFC107', // Amber for Investments
                '#9C27B0', // Purple for Gifts
                '#795548', // Brown for Rental Income
                '#607D8B', // Blue Grey for Other Income
            ],
            borderColor: '#FFFFFF', 
            borderWidth: 1,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333333', 
                    usePointStyle: true,
                    padding: 20,
                    font: { size: 14 }
                }
            },
            title: { display: false },
            tooltip: { boxPadding: 4 }
        },
    };

    return (
        <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-theme-text-primary text-center mb-4">
                Income Breakdown
            </h2>
            <div className="h-64 md:h-72 mx-auto">
                <Pie data={data} options={options} />
            </div>
        </div>
    );
};

export default IncomeChart;