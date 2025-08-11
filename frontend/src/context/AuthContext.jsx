import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token')); // Use callback to read only on init
    const [loading, setLoading] = useState(true); // ✅ Add a loading state, true by default

    useEffect(() => {
        try {
            if (token) {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({ id: decoded.user.id });
                }
            }
        } catch (error) {
            console.error("Invalid or expired token", error);
            setUser(null); // Ensure user is null if token is bad
        } finally {
            setLoading(false); // ✅ Set loading to false after check is complete
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        // The useEffect will automatically update the user and loading state
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};