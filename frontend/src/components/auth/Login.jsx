import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Correct path from components/auth
import authImage from '../../assets/signin.png';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    
    // ✅ Use the error state and login function from the context
    const { login, error, setError } = useContext(AuthContext); 
    const navigate = useNavigate();

    // Clear any previous login/register errors when the page loads
    useEffect(() => {
        setError(null);
    }, [setError]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // ✅ This is the corrected onSubmit function
    const onSubmit = async e => {
        e.preventDefault();
        try {
            // Call the login function from the context, which handles the API call
            await login(formData);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            // The error will be set in the AuthContext and displayed automatically
            console.error("Login attempt failed:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-theme-background p-4">
            <div className="w-full max-w-4xl mx-auto bg-theme-surface rounded-2xl shadow-xl overflow-hidden md:grid md:grid-cols-2">

                {/* Image Column */}
                <div className="p-8 md:p-12 flex flex-col justify-center items-center bg-gray-50">
                    <img src={authImage} alt="Financial Illustration" className="w-full max-w-xs h-auto" />
                    <h2 className="text-2xl font-bold text-theme-text-primary mt-6 text-center">Welcome Back!</h2>
                    <p className="text-theme-text-secondary mt-2 text-center">Let's get back to managing your finances.</p>
                </div>

                {/* Form Column */}
                <div className="p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-center text-theme-text-primary">Login</h2>
                    {/* ✅ This now displays the error from the global context */}
                    {error && <p className="text-red-600 bg-red-100 p-3 rounded-md my-4 text-center">{error}</p>}
                    <form onSubmit={onSubmit} className="space-y-6 mt-6">
                        <div>
                            <label className="text-sm font-bold text-theme-text-secondary">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={onChange} required className="w-full px-4 py-3 mt-2 text-theme-text-primary bg-gray-100 border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-theme-text-secondary">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={onChange} required className="w-full px-4 py-3 mt-2 text-theme-text-primary bg-gray-100 border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent" />
                        </div>
                        <button type="submit" className="w-full py-3 font-bold text-white bg-theme-primary rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary transition-opacity">Login</button>
                    </form>
                    <p className="text-sm text-center text-theme-text-secondary mt-6">
                        Don't have an account? <Link to="/register" className="font-medium text-theme-primary hover:underline">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;