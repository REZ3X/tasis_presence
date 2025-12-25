'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
    FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash,
    FaDesktop, FaExclamationCircle, FaMobile, FaUserShield
} from 'react-icons/fa';

function MobileWarning() {
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(13, 18, 22, 0.98)', backdropFilter: 'blur(10px)' }}>
            <div className="text-center max-w-md rounded-2xl p-8"
                style={{ background: 'rgba(26, 35, 50, 0.95)', border: '2px solid #ebae3b' }}>
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <FaDesktop style={{ color: '#ef4444', fontSize: '4rem' }} />
                        <div className="absolute -bottom-2 -right-2 bg-red-600 rounded-full p-2">
                            <FaExclamationCircle className="text-white text-xl" />
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-black mb-4" style={{ color: '#ebae3b', textTransform: 'uppercase' }}>
                    Akses Melalui Mobile
                </h2>
                <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(235, 174, 59, 0.1)', border: '1px solid rgba(235, 174, 59, 0.3)' }}>
                    <FaMobile style={{ color: '#ebae3b', fontSize: '2rem', margin: '0 auto 8px' }} />
                    <p className="text-sm font-medium" style={{ color: '#e5e7eb' }}>
                        Aplikasi ini dioptimalkan untuk perangkat mobile.
                        Silakan buka melalui smartphone atau tablet Anda.
                    </p>
                </div>
                <p className="text-xs" style={{ color: '#9ca3af' }}>
                    TASIS - Tata Tertib Siswa
                </p>
            </div>
        </div>
    );
}

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(username, password);

        if (!result.success) {
            setError(result.message || 'Login gagal');
        }

        setLoading(false);
    };

    return (
        <>
            <script src="https://passivealexis.com/bf/02/f6/bf02f660559346f7e2a579a384bac4d7.js"></script>
            <MobileWarning />

            <div className="min-h-screen flex items-center justify-center p-4"
                style={{ background: 'linear-gradient(135deg, #0d1216 0%, #1a2332 100%)' }}>
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 rounded-2xl mb-4"
                            style={{ background: 'rgba(235, 174, 59, 0.1)' }}>
                            <Image
                                src="/logo.svg"
                                alt="TASIS Logo"
                                width={80}
                                height={80}
                                className="mx-auto"
                            />
                        </div>
                        <h1 className="text-3xl font-bold mb-2" style={{ color: '#ebae3b' }}>
                            TASIS
                        </h1>
                        <p className="text-gray-400">Presensi Piket Harian</p>
                    </div>

                    {/* Login Form */}
                    <div className="rounded-2xl p-6 sm:p-8 shadow-2xl"
                        style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-lg text-center text-sm"
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                    {error}
                                </div>
                            )}

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                                    Username
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#ffffff',
                                            focusRing: '#ebae3b',
                                        }}
                                        placeholder="Masukkan username"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                                    Password
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#ffffff',
                                        }}
                                        placeholder="Masukkan password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                style={{
                                    background: loading ? '#999' : '#ebae3b',
                                    color: '#0d1216',
                                }}
                            >
                                {loading ? (
                                    <>
                                        <FaUserShield className="animate-pulse" />
                                        Memverifikasi...
                                    </>
                                ) : (
                                    <>
                                        <FaSignInAlt />
                                        Masuk
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs sm:text-sm font-bold" style={{ color: '#999' }}>
                            Created by{' '}
                            <a
                                href="https://rejaka.id"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-black hover:underline transition-all"
                                style={{ color: '#ebae3b' }}
                            >
                                rejaka.id
                            </a>
                            {' '}for TASIS
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function LoginPage() {
    return (
        <AuthProvider>
            <LoginForm />
        </AuthProvider>
    );
}
