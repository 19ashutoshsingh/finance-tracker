import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/core/Layout';

const HomePage = () => {
    return (
        <Layout>
            <div className="text-center">
                <h1 className="text-5xl font-bold text-theme-primary sm:text-4xl md:text-5xl">
                    Take Control of Your <span className="text-teal-400">Finances</span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-400 sm:text-xl md:text-2xl">
                    The simplest way to manage personal finances. Track your expenses, see where your money goes, and achieve your financial goals.
                </p>
                <div className="mt-8">
                    <Link
                        to="/register"
                        className="inline-block bg-teal-500 text-white font-bold text-lg px-8 py-3 rounded-full hover:bg-teal-600 transition duration-300"
                    >
                        Get Started for Free
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;