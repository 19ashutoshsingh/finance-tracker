import React from 'react';
import Header from './Header';

// ✅ The Layout now acts as a bridge, passing the function from the page to the header
const Layout = ({ children, onAddTransactionClick }) => {
    return (
        <div className="min-h-screen bg-theme-background text-theme-text-primary">
            <Header onAddTransactionClick={onAddTransactionClick} />
            <main className="max-w-6xl mx-auto p-4 sm:p-6">
                {children}
            </main>
        </div>
    );
};

export default Layout;