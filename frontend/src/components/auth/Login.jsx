import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import authImage from '../../assets/signin.png';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false); // ✅ 1. Add loading state
    const { login, error, setError } = useContext(AuthContext); 
    const navigate = useNavigate();

    useEffect(() => {
        setError(null);
    }, [setError]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true); // ✅ 2. Set loading to true
        try {
            await login(formData);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            console.error("Login attempt failed:", err);
        } finally {
            setLoading(false); // ✅ 3. Set loading to false
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-theme-background p-4">
            <div className="w-full max-w-4xl mx-auto bg-theme-surface rounded-2xl shadow-xl overflow-hidden md:grid md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center items-center bg-gray-50">
                    <img src={authImage} alt="Financial Illustration" className="w-full max-w-xs h-auto" />
                    <h2 className="text-2xl font-bold text-theme-text-primary mt-6 text-center">Welcome Back!</h2>
                    <p className="text-theme-text-secondary mt-2 text-center">Let's get back to managing your finances.</p>
                </div>
                <div className="p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-center text-theme-text-primary">Login</h2>
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
                        <button 
                            type="submit" 
                            disabled={loading} // ✅ 4. Disable button when loading
                            className="w-full py-3 font-bold text-white bg-theme-primary rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Login'} {/* ✅ 5. Change text when loading */}
                        </button>
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