import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ExpenseChart = ({ expenses }) => {
    const data = {
        labels: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'],
        datasets: [{
            label: 'Expenses by Category',
            data: [
                expenses.filter(e => e.category === 'Food').reduce((acc, e) => acc + e.amount, 0),
                expenses.filter(e => e.category === 'Transport').reduce((acc, e) => acc + e.amount, 0),
                expenses.filter(e => e.category === 'Entertainment').reduce((acc, e) => acc + e.amount, 0),
                expenses.filter(e => e.category === 'Utilities').reduce((acc, e) => acc + e.amount, 0),
                expenses.filter(e => e.category === 'Other').reduce((acc, e) => acc + e.amount, 0),
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
            ],
             borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#fff' // Legend text color
                }
            },
            title: {
                display: true,
                text: 'Expense Breakdown by Category',
                color: '#fff', // Title text color
                font: {
                    size: 20
                }
            },
        },
    };

    return (
       <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
           <Pie data={data} options={options} />
       </div>
    );
};

export default ExpenseChart;