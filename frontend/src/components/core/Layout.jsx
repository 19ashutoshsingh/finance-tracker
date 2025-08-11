import React from 'react';
import Header from './Header';

const Layout = ({ children, onTransactionAdded }) => {
    return (
        <div className="min-h-screen">
            <Header onTransactionAdded={onTransactionAdded} />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;