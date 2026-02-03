import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '@/services/api';

// Using 'any' for simplicity to match likely usage, or could define interface if I knew it.
// Based on Sidebar.tsx: user has name, role.
export type UserRole = 'admin' | 'architect' | 'hr' | 'accountant' | 'intern';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface LoginResult {
    success: boolean;
    error?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => Promise<LoginResult>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password?: string): Promise<LoginResult> => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                const { token, user: userData } = response.data;
                localStorage.setItem('token', token);
                setUser({
                    id: userData.id,
                    name: userData.name,
                    email: email, // Email isn't returned in the user object from this specific backend endpoint, using from input
                    role: userData.role.toLowerCase() as UserRole
                });
                return { success: true };
            }
            return { success: false, error: 'Login failed' };
        } catch (error: any) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'Invalid email or password';
            return { success: false, error: message };
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
