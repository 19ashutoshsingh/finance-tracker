import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

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
            setError(err.response.data.msg || 'Something went wrong');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-gray-400">Name</label>
                        <input type="text" name="name" onChange={onChange} required className="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                     <div>
                        <label className="text-sm font-bold text-gray-400">Email</label>
                        <input type="email" name="email" onChange={onChange} required className="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-400">Password</label>
                        <input type="password" name="password" onChange={onChange} required className="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <button type="submit" className="w-full py-2 font-bold text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">Register</button>
                </form>
                <p className="text-sm text-center text-gray-400">
                    Already have an account? <Link to="/login" className="font-medium text-teal-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;