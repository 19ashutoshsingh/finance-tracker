import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
// ✅ Imports the official list from your central file
import { expenseCategories } from '../../utils/categories';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ExpenseChart = ({ expenses }) => {

    const relevantExpenses = expenses.filter(e => expenseCategories.includes(e.category));

    if (relevantExpenses.length === 0) {
        return (
            <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold text-theme-text-primary text-center mb-4">
                    Expense Breakdown
                </h2>
                <div className="text-center text-theme-text-secondary py-10">
                    No expense data to display.
                </div>
            </div>
        );
    }
    
    const data = {
        labels: expenseCategories,
        datasets: [{
            label: 'Expense by Category',
            data: expenseCategories.map(cat => 
                expenses
                    .filter(e => e.category === cat)
                    .reduce((acc, e) => acc + e.amount, 0)
            ),
            // ✅ Colors for all 10 expense categories
            backgroundColor: [
                '#F44336', // Red for Food
                '#3F51B5', // Indigo for Transport
                '#9C27B0', // Purple for Entertainment
                '#FFEB3B', // Yellow for Utilities
                '#E91E63', // Pink for Shopping
                '#009688', // Teal for Health
                '#00BCD4', // Cyan for Housing
                '#FF9800', // Orange for Education
                '#673AB7', // Deep Purple for Subscriptions
                '#9E9E9E', // Grey for Other Expense
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
                Expense Breakdown
            </h2>
            <div className="h-64 md:h-72 mx-auto">
                <Pie data={data} options={options} />
            </div>
        </div>
    );
};

export default ExpenseChart;