import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import authImage from '../../assets/signin.png';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-theme-background p-4">
            <div className="w-full max-w-4xl mx-auto bg-theme-surface rounded-2xl shadow-xl overflow-hidden md:grid md:grid-cols-2">
                
                {/* Image Column */}
                <div className="p-8 md:p-12 flex flex-col justify-center items-center bg-gray-50">
                    <img src={authImage} alt="Financial Illustration" className="w-full max-w-xs h-auto" />
                     <h2 className="text-2xl font-bold text-theme-text-primary mt-6 text-center">Track Every Penny</h2>
                    <p className="text-theme-text-secondary mt-2 text-center">Your personal finance journey starts here.</p>
                </div>

                {/* Form Column */}
                <div className="p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-center text-theme-text-primary">Create Account</h2>
                    {error && <p className="text-red-600 bg-red-100 p-3 rounded-md my-4 text-center">{error}</p>}
                    <form onSubmit={onSubmit} className="space-y-6 mt-6">
                        <div>
                            <label className="text-sm font-bold text-theme-text-secondary">Name</label>
                            <input type="text" name="name" onChange={onChange} required className="w-full px-4 py-3 mt-2 text-theme-text-primary bg-gray-100 border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent" />
                        </div>
                         <div>
                            <label className="text-sm font-bold text-theme-text-secondary">Email</label>
                            <input type="email" name="email" onChange={onChange} required className="w-full px-4 py-3 mt-2 text-theme-text-primary bg-gray-100 border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-theme-text-secondary">Password</label>
                            <input type="password" name="password" onChange={onChange} required className="w-full px-4 py-3 mt-2 text-theme-text-primary bg-gray-100 border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent" />
                        </div>
                        <button type="submit" className="w-full py-3 font-bold text-white bg-theme-primary rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary transition-opacity">Register</button>
                    </form>
                    <p className="text-sm text-center text-theme-text-secondary mt-6">
                        Already have an account? <Link to="/login" className="font-medium text-theme-primary hover:underline">Login</Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;