import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user, loading } = useContext(AuthContext);

    // ✅ First, check if we are in the initial loading state
    if (loading) {
        // You can return a spinner or a loading component here
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    // ✅ After loading is false, then check for the user
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;