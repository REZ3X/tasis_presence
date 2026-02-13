'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    FaArrowLeft, FaUsers, FaClipboardList, FaFilter,
    FaEdit, FaTrash, FaUserShield, FaMapMarkerAlt, FaClock,
    FaDownload, FaSpinner, FaFileExcel, FaDesktop, FaMobile, FaExclamationCircle,
    FaUserCircle, FaChevronDown, FaUser, FaSignOutAlt, FaHome
} from 'react-icons/fa';
import TasisLoader from '@/components/TasisLoader';
import Modal from '@/components/Modal';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsAndService from '@/components/TermsAndService';

function MobileWarning({ userRole }) {
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

    if (userRole === 'dev' || userRole === 'staff' || userRole === 'watcher') return null;

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

function UserDropdown({ user, onNavigate, onLogout, isWatcher }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    return (
        <div className="relative flex-shrink-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                style={{
                    background: 'rgba(235, 174, 59, 0.1)',
                    border: '1px solid rgba(235, 174, 59, 0.3)',
                    maxWidth: '140px',
                }}
            >
                <FaUserCircle style={{ color: '#ebae3b', flexShrink: 0 }} size={20} />
                <span
                    className="text-sm font-semibold truncate"
                    style={{ color: '#ebae3b', maxWidth: '70px' }}
                >
                    {user.name.split(' ')[0]}
                </span>
                <FaChevronDown
                    style={{ color: '#ebae3b', flexShrink: 0 }}
                    size={12}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        className="absolute right-0 mt-2 w-64 rounded-lg shadow-2xl z-20 overflow-hidden"
                        style={{
                            background: '#1a2332',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid #ebae3b',
                        }}
                    >
                        <div className="p-4 border-b" style={{ borderColor: 'rgba(235, 174, 59, 0.3)', background: 'rgba(235, 174, 59, 0.05)' }}>
                            <p className="text-xs font-semibold" style={{ color: '#ebae3b' }}>USERNAME</p>
                            <p className="font-bold text-lg text-white">{user.username}</p>
                            <p className="text-xs font-semibold mt-3" style={{ color: '#ebae3b' }}>KELAS</p>
                            <p className="font-bold text-white">{user.class} {user.major}</p>
                            <div className="mt-3 px-3 py-1.5 rounded-lg inline-flex items-center gap-2"
                                style={{
                                    background: user.role === 'dev' ? 'rgba(139, 92, 246, 0.3)' :
                                        user.role === 'staff' ? 'rgba(59, 130, 246, 0.3)' :
                                            user.role === 'watcher' ? 'rgba(234, 179, 8, 0.3)' :
                                                'rgba(75, 85, 99, 0.3)',
                                    border: `1px solid ${user.role === 'dev' ? '#a78bfa' :
                                        user.role === 'staff' ? '#60a5fa' :
                                            user.role === 'watcher' ? '#eab308' : '#9ca3af'}`
                                }}>
                                <FaUserShield style={{
                                    color: user.role === 'dev' ? '#a78bfa' :
                                        user.role === 'staff' ? '#60a5fa' :
                                            user.role === 'watcher' ? '#eab308' : '#9ca3af'
                                }} />
                                <span className="font-black text-xs" style={{
                                    color: user.role === 'dev' ? '#a78bfa' :
                                        user.role === 'staff' ? '#60a5fa' :
                                            user.role === 'watcher' ? '#eab308' : '#9ca3af'
                                }}>
                                    {user.role.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onNavigate('/profile');
                            }}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 transition-all font-semibold"
                            style={{ color: '#e5e7eb', background: 'transparent' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(235, 174, 59, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <FaUser />
                            Profile
                        </button>

                        {!isWatcher && (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onNavigate('/');
                                }}
                                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-all font-semibold"
                                style={{ color: '#ebae3b', background: 'transparent' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(235, 174, 59, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <FaHome />
                                Presensi
                            </button>
                        )}

                        <button
                            onClick={onLogout}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 transition-all border-t font-semibold"
                            style={{ color: '#ef4444', borderColor: 'rgba(235, 174, 59, 0.3)', background: 'transparent' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

function AdminContent() {
    const { user, getToken, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('presences');
    const [presences, setPresences] = useState([]);
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [exportMonth, setExportMonth] = useState(new Date().getMonth() + 1);
    const [exportYear, setExportYear] = useState(new Date().getFullYear());
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [filter, setFilter] = useState({
        picketType: 'all',
        status: 'all',
        startDate: '',
        endDate: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        if (user) {
            if (user.role === 'basic') {
                router.push('/');
                return;
            }
            fetchData();
        }
    }, [user, activeTab, filter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, filter, userSearch]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = getToken();

            if (activeTab === 'presences') {
                const params = new URLSearchParams();
                if (filter.picketType !== 'all') params.append('picketType', filter.picketType);
                if (filter.status !== 'all') params.append('status', filter.status);
                if (filter.startDate) params.append('startDate', filter.startDate);
                if (filter.endDate) params.append('endDate', filter.endDate);

                const response = await fetch(`/api/presence/list?${params.toString()}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPresences(data.presences);
                }
            } else if (activeTab === 'users') {
                const response = await fetch('/api/users/list', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.users);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((u) => {
        const q = (userSearch || '').trim().toLowerCase();
        if (!q) return true;
        return (
            (u.name || '').toLowerCase().includes(q) ||
            (u.username || '').toLowerCase().includes(q) ||
            (u.class || '').toLowerCase().includes(q) ||
            (u.major || '').toLowerCase().includes(q)
        );
    });

    const totalPages = activeTab === 'presences'
        ? Math.ceil(presences.length / ITEMS_PER_PAGE)
        : Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const paginatedPresences = presences.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center gap-2 mt-6 mb-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-30"
                    style={{
                        background: 'rgba(235, 174, 59, 0.2)',
                        color: '#ebae3b',
                        border: '1px solid rgba(235, 174, 59, 0.3)'
                    }}
                >
                    ←
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => setCurrentPage(1)}
                            className="px-3 py-2 rounded-lg text-sm font-bold transition-all"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: '#94a3b8',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            1
                        </button>
                        {startPage > 2 && (
                            <span className="text-gray-500 px-1">...</span>
                        )}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${currentPage === page ? 'scale-110' : ''
                            }`}
                        style={currentPage === page ? {
                            background: '#ebae3b',
                            color: '#0d1216',
                            border: '2px solid #ebae3b'
                        } : {
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#94a3b8',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && (
                            <span className="text-gray-500 px-1">...</span>
                        )}
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="px-3 py-2 rounded-lg text-sm font-bold transition-all"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: '#94a3b8',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-30"
                    style={{
                        background: 'rgba(235, 174, 59, 0.2)',
                        color: '#ebae3b',
                        border: '1px solid rgba(235, 174, 59, 0.3)'
                    }}
                >
                    →
                </button>
            </div>
        );
    };

    const handleDeletePresence = async (id) => {
        if (!confirm('Yakin ingin menghapus presensi ini?')) return;

        try {
            const token = getToken();
            const response = await fetch(`/api/presence/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting presence:', error);
        }
    };

    const handleExportCSV = async () => {
        setExporting(true);
        try {
            const token = getToken();
            const params = new URLSearchParams();
            params.append('month', exportMonth);
            params.append('year', exportYear);
            params.append('format', 'csv');

            const response = await fetch(`/api/presence/export?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `presensi_${exportYear}_${String(exportMonth).padStart(2, '0')}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                const data = await response.json();
                alert(data.error || 'Gagal mengexport data');
            }
        } catch (error) {
            console.error('Error exporting:', error);
            alert('Gagal mengexport data');
        } finally {
            setExporting(false);
        }
    };

    if (!user || user.role === 'basic') {
        return null;
    }

    return (
        <>
            <MobileWarning userRole={user.role} />
            <div className="min-h-screen flex flex-col"
                style={{ background: 'linear-gradient(135deg, #0d1216 0%, #1a2332 100%)' }}>
                {/* Header */}
                <div className="sticky top-0 z-50 px-4 py-5 border-b"
                    style={{
                        background: 'rgba(13, 18, 22, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderColor: 'rgba(235, 174, 59, 0.2)',
                        zIndex: 9999,
                    }}>
                    <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                            {user.role !== 'watcher' && (
                                <button
                                    onClick={() => router.push('/')}
                                    className="p-2.5 rounded-xl transition-all"
                                    style={{ background: 'rgba(235, 174, 59, 0.1)', color: '#ebae3b' }}
                                >
                                    <FaArrowLeft size={18} />
                                </button>
                            )}
                            <Image src="/logo.svg" alt="TASIS" width={44} height={44} />
                            <div>
                                <h1 className="text-xl font-bold" style={{ color: '#ebae3b' }}>
                                    Admin Panel
                                </h1>
                                <p className="text-sm text-gray-400">
                                    {user.role === 'dev' ? 'Full Access' : 'View Only'}
                                </p>
                            </div>
                        </div>
                        <UserDropdown
                            user={user}
                            onNavigate={router.push}
                            onLogout={logout}
                            isWatcher={user.role === 'watcher'}
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-3 lg:max-w-md">
                        <button
                            onClick={() => setActiveTab('presences')}
                            className={`flex-1 py-3 px-4 rounded-xl transition-all font-bold ${activeTab === 'presences'
                                ? 'text-black'
                                : 'text-gray-400'
                                }`}
                            style={{
                                background: activeTab === 'presences' ? '#ebae3b' : 'rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            <FaClipboardList className="inline mr-2" />
                            Presensi
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex-1 py-3 px-4 rounded-xl transition-all font-bold ${activeTab === 'users'
                                ? 'text-black'
                                : 'text-gray-400'
                                }`}
                            style={{
                                background: activeTab === 'users' ? '#ebae3b' : 'rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            <FaUsers className="inline mr-2" />
                            Users
                        </button>
                    </div>
                    </div>
                </div>

                <main className="px-4 py-6 space-y-5 flex-1 max-w-6xl mx-auto w-full">
                    {/* Filters for Presences */}
                    {activeTab === 'presences' && (
                        <div className="rounded-2xl px-5 py-5 shadow-2xl"
                            style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#ebae3b' }}>
                                <FaFilter />
                                Filter
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <select
                                    value={filter.picketType}
                                    onChange={(e) => setFilter({ ...filter, picketType: e.target.value })}
                                    className="px-3 py-2 rounded-lg text-sm"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff',
                                    }}
                                >
                                    <option value="all" style={{ background: '#1a2332', color: '#ffffff' }}>Semua Jenis</option>
                                    <option value="Piket Pagi" style={{ background: '#1a2332', color: '#ffffff' }}>Piket Pagi</option>
                                    <option value="Piket Sore" style={{ background: '#1a2332', color: '#ffffff' }}>Piket Sore</option>
                                </select>

                                <select
                                    value={filter.status}
                                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                    className="px-3 py-2 rounded-lg text-sm"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff',
                                    }}
                                >
                                    <option value="all" style={{ background: '#1a2332', color: '#ffffff' }}>Semua Status</option>
                                    <option value="Tepat Waktu" style={{ background: '#1a2332', color: '#ffffff' }}>Tepat Waktu</option>
                                    <option value="Terlambat" style={{ background: '#1a2332', color: '#ffffff' }}>Terlambat</option>
                                </select>

                                <input
                                    type="date"
                                    value={filter.startDate}
                                    onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                                    className="px-3 py-2 rounded-lg text-sm"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff',
                                    }}
                                    placeholder="Dari Tanggal"
                                />

                                <input
                                    type="date"
                                    value={filter.endDate}
                                    onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                                    className="px-3 py-2 rounded-lg text-sm"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff',
                                    }}
                                    placeholder="Sampai Tanggal"
                                />
                            </div>
                            <button
                                onClick={() => setFilter({ picketType: 'all', status: 'all', startDate: '', endDate: '' })}
                                className="w-full mt-3 py-2 rounded-lg text-sm font-semibold transition-all"
                                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}

                    {/* Export Section */}
                    {activeTab === 'presences' && (
                        <div className="rounded-2xl px-5 py-5 shadow-2xl"
                            style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#ebae3b' }}>
                                <FaFileExcel />
                                Export Rekap Bulanan
                            </h3>
                            <div className="flex gap-3 mb-4 lg:max-w-md">
                                <select
                                    value={exportMonth}
                                    onChange={(e) => setExportMonth(parseInt(e.target.value))}
                                    className="flex-1 px-3 py-2.5 rounded-lg text-sm"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff',
                                    }}
                                >
                                    <option value="1" style={{ background: '#1a2332' }}>Januari</option>
                                    <option value="2" style={{ background: '#1a2332' }}>Februari</option>
                                    <option value="3" style={{ background: '#1a2332' }}>Maret</option>
                                    <option value="4" style={{ background: '#1a2332' }}>April</option>
                                    <option value="5" style={{ background: '#1a2332' }}>Mei</option>
                                    <option value="6" style={{ background: '#1a2332' }}>Juni</option>
                                    <option value="7" style={{ background: '#1a2332' }}>Juli</option>
                                    <option value="8" style={{ background: '#1a2332' }}>Agustus</option>
                                    <option value="9" style={{ background: '#1a2332' }}>September</option>
                                    <option value="10" style={{ background: '#1a2332' }}>Oktober</option>
                                    <option value="11" style={{ background: '#1a2332' }}>November</option>
                                    <option value="12" style={{ background: '#1a2332' }}>Desember</option>
                                </select>
                                <select
                                    value={exportYear}
                                    onChange={(e) => setExportYear(parseInt(e.target.value))}
                                    className="px-3 py-2.5 rounded-lg text-sm"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff',
                                    }}
                                >
                                    <option value="2024" style={{ background: '#1a2332' }}>2024</option>
                                    <option value="2025" style={{ background: '#1a2332' }}>2025</option>
                                    <option value="2026" style={{ background: '#1a2332' }}>2026</option>
                                </select>
                            </div>
                            <button
                                onClick={handleExportCSV}
                                disabled={exporting}
                                className="w-full py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                style={{ background: '#22c55e', color: '#0d1216' }}
                            >
                                {exporting ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Mengexport...
                                    </>
                                ) : (
                                    <>
                                        <FaDownload />
                                        Download CSV
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-gray-400 mt-3 text-center">
                                Export data presensi termasuk link foto Google Drive
                            </p>
                            <div className="mt-3 text-center">
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1UAtLhH3_QOeGYiEDQk-vBTeHCaF8QuPwnScNjDC5Fuo/edit?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-3 py-2 rounded-lg font-semibold"
                                    style={{ background: 'transparent', color: '#ebae3b', border: '1px solid rgba(235,174,59,0.2)' }}
                                >
                                    Lihat data spreadsheet (real-time)
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    {loading ? (
                        <div className="text-center py-12">
                            <TasisLoader />
                        </div>
                    ) : (
                        <>
                            {/* Presences List */}
                            {activeTab === 'presences' && (
                                <div className="space-y-4">
                                    {presences.length === 0 ? (
                                        <div className="text-center py-12 rounded-2xl"
                                            style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                                            <p className="text-gray-400">Tidak ada data presensi</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-center py-2">
                                                <p className="text-sm text-gray-400">
                                                    Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, presences.length)} dari {presences.length} presensi
                                                </p>
                                            </div>
                                            <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
                                            {paginatedPresences.map((presence) => (
                                                <div
                                                    key={presence.id}
                                                    className="rounded-xl px-5 py-4 shadow-lg"
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.06)',
                                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <p className="font-bold text-base" style={{ color: '#ebae3b' }}>
                                                                {presence.username}
                                                            </p>
                                                            <p className="text-sm text-gray-400 mt-0.5">{presence.picketType}</p>
                                                        </div>
                                                        <span
                                                            className="text-xs px-3 py-1.5 rounded-lg font-black border-2 uppercase tracking-wide"
                                                            style={presence.status === 'Tepat Waktu'
                                                                ? { background: 'rgba(34, 197, 94, 0.25)', color: '#4ade80', borderColor: '#22c55e' }
                                                                : { background: 'rgba(239, 68, 68, 0.25)', color: '#f87171', borderColor: '#ef4444' }
                                                            }
                                                        >
                                                            {presence.status}
                                                        </span>
                                                    </div>

                                                    {presence.area && (
                                                        <p className="text-sm mb-2 flex items-center gap-2" style={{ color: '#94a3b8' }}>
                                                            <FaMapMarkerAlt style={{ color: '#60a5fa' }} size={14} />
                                                            {presence.area}
                                                        </p>
                                                    )}

                                                    <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
                                                        <FaClock className="inline mr-2" size={12} />
                                                        {new Date(presence.timestamp).toLocaleString('id-ID', {
                                                            timeZone: 'Asia/Jakarta',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>

                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => router.push(`/presence/${presence.id}`)}
                                                            className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                                                            style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}
                                                        >
                                                            Detail
                                                        </button>
                                                        {user.role === 'dev' && (
                                                            <button
                                                                onClick={() => handleDeletePresence(presence.id)}
                                                                className="px-4 py-2.5 rounded-lg text-sm font-bold transition-all"
                                                                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            </div>
                                            {renderPagination()}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Users List */}
                            {activeTab === 'users' && (
                                <div className="space-y-4">
                                    <div className="rounded-2xl px-5 py-4 shadow-2xl"
                                        style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                                        <input
                                            type="search"
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                            placeholder="Cari pengguna, nama, kelas, atau username..."
                                            className="w-full px-3 py-2 rounded-lg text-sm"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.02)',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                color: '#ffffff',
                                            }}
                                        />
                                    </div>

                                    {users.length === 0 ? (
                                        <div className="text-center py-12 rounded-2xl"
                                            style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                                            <p className="text-gray-400">Tidak ada data user</p>
                                        </div>
                                    ) : filteredUsers.length === 0 ? (
                                        <div className="text-center py-12 rounded-2xl"
                                            style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                                            <p className="text-gray-400">Tidak ada user yang cocok</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-center py-2">
                                                <p className="text-sm text-gray-400">
                                                    Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} dari {filteredUsers.length} user
                                                </p>
                                            </div>
                                            <div className="lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 space-y-4 lg:space-y-0">
                                            {paginatedUsers.map((u) => (
                                                <div
                                                    key={u.id}
                                                    className="rounded-xl px-5 py-4 shadow-lg"
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.06)',
                                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <p className="font-bold text-base text-white">{u.name}</p>
                                                            <p className="text-sm text-gray-400 mt-0.5">@{u.username}</p>
                                                        </div>
                                                        <span className="text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold border"
                                                            style={u.role === 'dev' ? {
                                                                background: 'rgba(139, 92, 246, 0.25)',
                                                                color: '#c4b5fd',
                                                                borderColor: '#a78bfa'
                                                            } : u.role === 'staff' ? {
                                                                background: 'rgba(59, 130, 246, 0.25)',
                                                                color: '#93c5fd',
                                                                borderColor: '#60a5fa'
                                                            } : u.role === 'watcher' ? {
                                                                background: 'rgba(234, 179, 8, 0.25)',
                                                                color: '#fde047',
                                                                borderColor: '#eab308'
                                                            } : {
                                                                background: 'rgba(156, 163, 175, 0.25)',
                                                                color: '#d1d5db',
                                                                borderColor: '#9ca3af'
                                                            }}>
                                                            <FaUserShield />
                                                            {u.role.toUpperCase()}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>
                                                        {u.class} {u.major}
                                                    </p>

                                                    {user.role === 'dev' && u.role !== 'dev' && (
                                                        <button
                                                            onClick={() => router.push(`/admin/user/${u.id}`)}
                                                            className="w-full py-2.5 rounded-lg text-sm font-bold transition-all"
                                                            style={{ background: 'rgba(235, 174, 59, 0.2)', color: '#ebae3b' }}
                                                        >
                                                            <FaEdit className="inline mr-2" />
                                                            Edit User
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            </div>
                                            {renderPagination()}
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Stats */}
                    {
                        !loading && ((activeTab === 'presences' && presences.length > 0) || (activeTab === 'users' && users.length > 0)) && (
                            <div className="rounded-2xl px-5 py-6 shadow-2xl"
                                style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                                <h3 className="text-sm font-bold mb-5" style={{ color: '#ebae3b' }}>
                                    Statistik
                                </h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 text-center">
                                    {activeTab === 'presences' ? (
                                        <>
                                            <div>
                                                <p className="text-2xl font-bold text-white">
                                                    {presences.length}
                                                </p>
                                                <p className="text-xs text-gray-400">Total Presensi</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>
                                                    {presences.filter(p => p.status === 'Tepat Waktu').length}
                                                </p>
                                                <p className="text-xs text-gray-400">Tepat Waktu</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>
                                                    {presences.filter(p => p.status === 'Terlambat').length}
                                                </p>
                                                <p className="text-xs text-gray-400">Terlambat</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold" style={{ color: '#ebae3b' }}>
                                                    {new Set(presences.map(p => p.username)).size}
                                                </p>
                                                <p className="text-xs text-gray-400">Unique Users</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <p className="text-2xl font-bold text-white">
                                                    {users.length}
                                                </p>
                                                <p className="text-xs text-gray-400">Total Users</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold" style={{ color: '#a78bfa' }}>
                                                    {users.filter(u => u.role === 'dev').length}
                                                </p>
                                                <p className="text-xs text-gray-400">Developers</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold" style={{ color: '#60a5fa' }}>
                                                    {users.filter(u => u.role === 'staff').length}
                                                </p>
                                                <p className="text-xs text-gray-400">Staff</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold" style={{ color: '#eab308' }}>
                                                    {users.filter(u => u.role === 'watcher').length}
                                                </p>
                                                <p className="text-xs text-gray-400">Watchers</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold" style={{ color: '#ebae3b' }}>
                                                    {new Set(users.map(u => `${u.class || ''}-${u.major || ''}`)).size}
                                                </p>
                                                <p className="text-xs text-gray-400">Unique Class/Major</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    }
                </main>

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
                <div className="mt-8 text-center max-w-6xl mx-auto px-4 pb-6">
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
            </div >
        </>
    );
}

export default function AdminPage() {
    return (
        <AuthProvider>
            <AdminContent />
        </AuthProvider>
    );
}