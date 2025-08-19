// frontend/src/components/dashboard/Insights.jsx

import React from 'react';
import { FaLightbulb, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const InsightCard = ({ insight }) => {
    const getIcon = () => {
        switch (insight.type) {
            case 'warning':
                return <FaExclamationTriangle className="text-yellow-500" />;
            case 'info':
                return <FaInfoCircle className="text-blue-500" />;
            default:
                return <FaLightbulb className="text-purple-500" />;
        }
    };

    const formatMessage = (message) => {
        const parts = message.split('**');
        return parts.map((part, index) => 
            index % 2 === 1 ? <strong key={index} className="font-bold text-theme-text-primary">{part}</strong> : part
        );
    };

    return (
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mt-1">{getIcon()}</div>
            <p className="text-theme-text-secondary">{formatMessage(insight.message)}</p>
        </div>
    );
};

const Insights = ({ insights, loading }) => {
    if (loading) {
        return (
            <div className="bg-theme-surface p-6 rounded-2xl shadow-md text-center">
                <p className="text-theme-text-secondary">Analyzing your habits...</p>
            </div>
        );
    }

    if (!insights || insights.length === 0) {
        // You can return null or a placeholder message
        return (
            <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold text-theme-text-primary mb-4">Financial Insights</h2>
                <p className="text-theme-text-secondary text-center py-4">No new insights to show. Keep tracking your expenses to generate more!</p>
            </div>
        );
    }

    return (
        <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-theme-text-primary mb-4">Financial Insights</h2>
            {/* ✅ This div now has a max-height and will scroll if content overflows */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {insights.map((insight, index) => (
                    <InsightCard key={index} insight={insight} />
                ))}
            </div>
        </div>
    );
};

export default Insights;