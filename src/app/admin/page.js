'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    FaArrowLeft, FaUsers, FaClipboardList, FaFilter,
    FaEdit, FaTrash, FaUserShield, FaMapMarkerAlt, FaClock,
    FaDownload, FaSpinner, FaFileExcel, FaDesktop, FaMobile, FaExclamationCircle
} from 'react-icons/fa';
import TasisLoader from '@/components/TasisLoader';

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

function AdminContent() {
    const { user, getToken } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('presences');
    const [presences, setPresences] = useState([]);
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [exportMonth, setExportMonth] = useState(new Date().getMonth() + 1);
    const [exportYear, setExportYear] = useState(new Date().getFullYear());
    const [filter, setFilter] = useState({
        picketType: 'all',
        status: 'all',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        if (user) {
            if (user.role === 'basic') {
                router.push('/');
                return;
            }
            fetchData();
        }
    }, [user, activeTab, filter]);

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
            <MobileWarning />
            <div className="min-h-screen pb-20"
                style={{ background: 'linear-gradient(135deg, #0d1216 0%, #1a2332 100%)' }}>
                {/* Header */}
                <div className="sticky top-0 z-10 px-4 py-5 border-b"
                    style={{
                        background: 'rgba(13, 18, 22, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderColor: 'rgba(235, 174, 59, 0.2)',
                    }}>
                    <div className="flex items-center gap-4 mb-5">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2.5 rounded-xl transition-all"
                            style={{ background: 'rgba(235, 174, 59, 0.1)', color: '#ebae3b' }}
                        >
                            <FaArrowLeft size={18} />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold" style={{ color: '#ebae3b' }}>
                                Admin Panel
                            </h1>
                            <p className="text-sm text-gray-400">
                                {user.role === 'dev' ? 'Full Access' : 'View Only'}
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-3">
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

                <div className="px-4 py-6 space-y-5">
                    {/* Filters for Presences */}
                    {activeTab === 'presences' && (
                        <div className="rounded-2xl px-5 py-5 shadow-2xl"
                            style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#ebae3b' }}>
                                <FaFilter />
                                Filter
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
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
                            <div className="flex gap-3 mb-4">
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
                                        presences.map((presence) => (
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
                                        ))
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
                                        filteredUsers.map((u) => (
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

                                                {user.role === 'dev' && (
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
                                        ))
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
                                <div className="grid grid-cols-2 gap-5 text-center">
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
                </div >
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
