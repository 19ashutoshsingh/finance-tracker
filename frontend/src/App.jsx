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
import BudgetsPage from './pages/BudgetsPage';
import DebtsPage from './pages/DebtsPage'; // ✅ Import the new Debts page
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <AuthProvider>
            <TransactionProvider>
                <Router>
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                    />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/dashboard" element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>

                        <Route path="/transactions" element={<PrivateRoute />}>
                            <Route path="/transactions" element={<AllTransactionsPage />} />
                        </Route>
                        
                        <Route path="/budgets" element={<PrivateRoute />}>
                            <Route path="/budgets" element={<BudgetsPage />} />
                        </Route>
                        
                        {/* ✅ Add the new route for the Debts page */}
                        <Route path="/debts" element={<PrivateRoute />}>
                            <Route path="/debts" element={<DebtsPage />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </TransactionProvider>
        </AuthProvider>
    );
}

export default App;