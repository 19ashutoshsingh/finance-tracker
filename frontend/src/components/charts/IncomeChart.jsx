import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const IncomeChart = ({ transactions }) => {
    const incomeCategories = ['Salary', 'Bonus', 'Freelance', 'Other Income'];

    const data = {
        labels: incomeCategories,
        datasets: [{
            label: 'Income by Category',
            data: incomeCategories.map(cat => 
                transactions
                    .filter(t => t.category === cat)
                    .reduce((acc, t) => acc + t.amount, 0)
            ),
            backgroundColor: [
                '#D9534F', // Soft Red
                '#5BC0DE', // Info Blue
                '#9B59B6', // Amethyst Purple
                '#F0AD4E', // Warning Orange
                '#777777', // Medium Gray
            ],
            // Use a light border color to match the card's background
            borderColor: '#FFFFFF', 
            borderWidth: 4,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    // Use the primary text color from your theme
                    color: '#333333', 
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 14,
                    }
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                boxPadding: 4,
            }
        },
    };

    return (
        // Use the theme-surface for the card background
        <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
            {/* Use the primary text color for the title */}
            <h2 className="text-xl font-bold text-theme-text-primary text-center mb-4">
                Income Breakdown
            </h2>

            {/* Container with a specific height to ensure proper sizing */}
            <div className="h-64 md:h-72 mx-auto">
                <Pie data={data} options={options} />
            </div>
        </div>
    );
};

export default IncomeChart;