'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft, FaUser, FaUserShield, FaDesktop, FaMobile, FaExclamationCircle } from 'react-icons/fa';
import TasisLoader from '@/components/TasisLoader';
import Modal from '@/components/Modal';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsAndService from '@/components/TermsAndService';

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

function ProfileContent() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0d1216 0%, #1a2332 100%)' }}>
                <TasisLoader />
            </div>
        );
    }

    return (
        <>
            <MobileWarning />
            <div className="min-h-screen pb-20"
                style={{ background: 'linear-gradient(135deg, #0d1216 0%, #1a2332 100%)' }}>
                {/* Header */}
                <div className="sticky top-0 z-10 p-4 border-b"
                    style={{
                        background: 'rgba(13, 18, 22, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderColor: 'rgba(235, 174, 59, 0.2)',
                    }}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 rounded-lg transition-all"
                            style={{ background: 'rgba(235, 174, 59, 0.1)', color: '#ebae3b' }}
                        >
                            <FaArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold" style={{ color: '#ebae3b' }}>
                                Profile
                            </h1>
                            <p className="text-xs text-gray-400">Informasi Akun</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-6">
                    {/* Logo */}
                    <div className="text-center pt-8">
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
                    </div>

                    {/* User Info */}
                    <div className="rounded-2xl p-6 shadow-2xl"
                        style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#ebae3b' }}>
                            <FaUser />
                            Informasi Akun
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Nama Lengkap</label>
                                <div className="px-4 py-3 rounded-lg"
                                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <p className="font-semibold text-white">{user.name}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Username</label>
                                <div className="px-4 py-3 rounded-lg"
                                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <p className="font-semibold text-white">{user.username}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Kelas</label>
                                <div className="px-4 py-3 rounded-lg"
                                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <p className="font-semibold text-white">{user.class}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Jurusan</label>
                                <div className="px-4 py-3 rounded-lg"
                                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <p className="font-semibold text-white">{user.major}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Role</label>
                                <div className="px-4 py-3 rounded-lg flex items-center gap-2"
                                    style={{
                                        background: user.role === 'dev' ? 'rgba(139, 92, 246, 0.1)' :
                                            user.role === 'staff' ? 'rgba(59, 130, 246, 0.1)' :
                                                'rgba(75, 85, 99, 0.1)',
                                        border: `1px solid ${user.role === 'dev' ? 'rgba(139, 92, 246, 0.3)' :
                                            user.role === 'staff' ? 'rgba(59, 130, 246, 0.3)' :
                                                'rgba(75, 85, 99, 0.3)'
                                            }`
                                    }}>
                                    <FaUserShield style={{
                                        color: user.role === 'dev' ? '#a78bfa' :
                                            user.role === 'staff' ? '#60a5fa' : '#9ca3af'
                                    }} />
                                    <p className="font-semibold uppercase"
                                        style={{
                                            color: user.role === 'dev' ? '#a78bfa' :
                                                user.role === 'staff' ? '#60a5fa' : '#9ca3af'
                                        }}>
                                        {user.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Permissions Info */}
                    <div className="rounded-2xl p-6 shadow-2xl"
                        style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                        <h3 className="text-sm font-semibold mb-4" style={{ color: '#ebae3b' }}>
                            Hak Akses
                        </h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            {user.role === 'basic' && (
                                <>
                                    <p>✓ Input presensi piket</p>
                                    <p>✓ Lihat riwayat presensi sendiri</p>
                                </>
                            )}
                            {user.role === 'staff' && (
                                <>
                                    <p>✓ Input presensi piket</p>
                                    <p>✓ Lihat riwayat presensi sendiri</p>
                                    <p>✓ Akses admin panel (lihat saja)</p>
                                    <p>✓ Lihat data semua user</p>
                                    <p>✓ Lihat semua presensi</p>
                                </>
                            )}
                            {user.role === 'dev' && (
                                <>
                                    <p>✓ Input presensi piket</p>
                                    <p>✓ Lihat riwayat presensi sendiri</p>
                                    <p>✓ Akses penuh admin panel</p>
                                    <p>✓ Edit/hapus data presensi</p>
                                    <p>✓ Edit data user (role, password, dll)</p>
                                    <p>✓ Lihat semua data</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="w-full py-4 rounded-lg font-bold text-lg transition-all"
                        style={{ background: '#ef4444', color: '#ffffff' }}
                    >
                        Logout
                    </button>

                    <Modal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        title={modalType === 'privacy' ? 'Kebijakan Privasi' : 'Syarat & Ketentuan'}
                        className="max-w-3xl"
                        style={{ zIndex: 10000 }}
                    >
                        {modalType === 'privacy' ? <PrivacyPolicy /> : <TermsAndService />}
                    </Modal>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <div className="text-xs leading-relaxed flex-1" style={{ color: '#e5e7eb' }}>
                            <span
                                onClick={() => { setModalType('privacy'); setModalOpen(true); }}
                                className="font-semibold hover:underline cursor-pointer"
                                style={{ color: '#ebae3b' }}
                            >
                                Kebijakan Privasi
                            </span>
                            {' '}|{' '}
                            <span
                                onClick={() => { setModalType('terms'); setModalOpen(true); }}
                                className="font-semibold hover:underline cursor-pointer"
                                style={{ color: '#ebae3b' }}
                            >
                                Syarat & Ketentuan
                            </span>
                        </div>
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

export default function ProfilePage() {
    return (
        <AuthProvider>
            <ProfileContent />
        </AuthProvider>
    );
}
