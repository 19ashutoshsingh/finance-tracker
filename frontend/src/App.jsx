import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import AllTransactionsPage from './pages/AllTransactions'; 
import { TransactionProvider } from './context/TransactionContext';

function App() {
    return (
        <AuthProvider>
            <Router>
            <TransactionProvider>

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                    {/* ADD THIS NEW ROUTE */}
                    <Route path="/transactions" element={<PrivateRoute />}>
                        <Route path="/transactions" element={<AllTransactionsPage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </TransactionProvider>
            </Router>
        </AuthProvider>
    );
}

export default App;