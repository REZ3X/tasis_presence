'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('tasis_token');

            if (!token) {
                setLoading(false);
                if (pathname !== '/login') {
                    router.push('/login');
                }
                return;
            }

            const response = await fetch('/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                localStorage.removeItem('tasis_token');
                if (pathname !== '/login') {
                    router.push('/login');
                }
            }
        } catch (error) {
            console.error('Auth check error:', error);
            localStorage.removeItem('tasis_token');
            if (pathname !== '/login') {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('tasis_token', data.token);
            setUser(data.user);
            if (data.user.role === 'watcher') {
                router.push('/admin');
            } else {
                router.push('/');
            }
            return { success: true };
        }

        return { success: false, message: data.message };
    };

    const logout = () => {
        localStorage.removeItem('tasis_token');
        setUser(null);
        router.push('/login');
    };

    const getToken = () => {
        return localStorage.getItem('tasis_token');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
