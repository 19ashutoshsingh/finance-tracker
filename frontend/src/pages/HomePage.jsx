import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/core/Layout';
import hero from '../assets/hero.png'; 
import { FaChartPie, FaBullseye, FaLightbulb } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext'; // ✅ 1. Import AuthContext

const HomePage = () => {
    // ✅ 2. Get user status and navigation tools
    const { token, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    // ✅ 3. Add effect to redirect logged-in users
    useEffect(() => {
        // Wait for the initial auth check to complete
        if (!loading && token) {
            navigate('/dashboard');
        }
    }, [token, loading, navigate]);

    const features = [
        {
            icon: <FaChartPie className="h-8 w-8 text-theme-primary" />,
            title: "Track Everything",
            description: "Easily record your income and expenses. See exactly where your money goes with our simple-to-use interface."
        },
        {
            icon: <FaBullseye className="h-8 w-8 text-theme-primary" />,
            title: "Set Budgets",
            description: "Create monthly budgets for different categories to stay on track and reach your financial goals faster."
        },
        {
            icon: <FaLightbulb className="h-8 w-8 text-theme-primary" />,
            title: "Get Real-time Insights",
            description: "Receive instant alerts and see your top spending categories to make smarter financial decisions."
        }
    ];

    // ✅ 4. Prevent the homepage from flashing for logged-in users
    if (loading || token) {
        return null; // Or you can return a loading spinner component
    }

    // This JSX will only be shown to users who are not logged in
    return (
        <Layout>
            <div className="space-y-20 py-12">
                
                {/* Hero Section */}
                <section className="container mx-auto px-4 text-center lg:text-left">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="wow animate__animated animate__fadeInLeft">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-theme-text-primary leading-tight">
                                Master Your Money, <br />
                                <span className="text-theme-primary">Achieve Your Goals.</span>
                            </h1>
                            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-theme-text-secondary">
                                The simplest way to manage personal finances. Track, budget, and get real-time insights to take full control of your financial life.
                            </p>
                            <div className="mt-8">
                                <Link
                                    to="/register"
                                    className="inline-block bg-theme-primary text-white font-bold text-lg px-8 py-3 rounded-full hover:opacity-90 transition-transform hover:scale-105"
                                >
                                    Get Started for Free
                                </Link>
                            </div>
                        </div>
                        <div className="wow animate__animated animate__fadeInRight flex justify-center">
                            <img 
                                src={hero} 
                                alt="FinanceTracker App" 
                                className="max-w-xs md:max-w-sm lg:max-w-md"
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-4">
                    <div className="text-center mb-12 wow animate__animated animate__fadeInUp">
                        <h2 className="text-3xl md:text-4xl font-bold text-theme-text-primary">Everything You Need, All in One Place</h2>
                        <p className="mt-4 text-lg text-theme-text-secondary">Powerful features to help you succeed.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className="bg-theme-surface p-8 rounded-2xl shadow-md text-center wow animate__animated animate__fadeInUp"
                                data-wow-delay={`${index * 0.1}s`}
                            >
                                <div className="flex justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-theme-text-primary mb-2">{feature.title}</h3>
                                <p className="text-theme-text-secondary">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final Call-to-Action Section */}
                <section className="container mx-auto px-4 text-center wow animate__animated animate__fadeInUp">
                    <h2 className="text-3xl md:text-4xl font-bold text-theme-text-primary">Ready to Take Control?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-theme-text-secondary">
                        Start tracking your finances in minutes. It's free to get started.
                    </p>
                    <div className="mt-8">
                        <Link
                            to="/register"
                            className="inline-block bg-theme-primary text-white font-bold text-lg px-8 py-3 rounded-full hover:opacity-90 transition-transform hover:scale-105"
                        >
                            Sign Up Now
                        </Link>
                    </div>
                </section>

            </div>
        </Layout>
    );
};

export default HomePage;