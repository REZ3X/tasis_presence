'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import TasisLoader from '@/components/TasisLoader';
import Modal from '@/components/Modal';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsAndService from '@/components/TermsAndService';

function EditUserContent() {
    const { user: currentUser, getToken } = useAuth();
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        class: '',
        major: '',
        role: 'basic',
        password: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    useEffect(() => {
        if (currentUser) {
            if (currentUser.role !== 'dev') {
                router.push('/admin');
                return;
            }
            fetchUser();
        }
    }, [currentUser]);

    const fetchUser = async () => {
        try {
            const token = getToken();
            const response = await fetch(`/api/users/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setFormData({
                    username: data.user.username,
                    name: data.user.name,
                    class: data.user.class,
                    major: data.user.major,
                    role: data.user.role,
                    password: '',
                });
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess(false);

        try {
            const token = getToken();
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }

            const response = await fetch(`/api/users/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                setSuccess(true);
                setFormData({ ...formData, password: '' });
                setTimeout(() => {
                    router.push('/admin');
                }, 1500);
            } else {
                const data = await response.json();
                setError(data.message || 'Gagal memperbarui user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Terjadi kesalahan');
        } finally {
            setSaving(false);
        }
    };

    if (loading || !currentUser || currentUser.role !== 'dev') {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0d1216 0%, #1a2332 100%)' }}>
                <TasisLoader />
            </div>
        );
    }

    return (
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
                        onClick={() => router.push('/admin')}
                        className="p-2 rounded-lg transition-all"
                        style={{ background: 'rgba(235, 174, 59, 0.1)', color: '#ebae3b' }}
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold" style={{ color: '#ebae3b' }}>
                            Edit User
                        </h1>
                        <p className="text-xs text-gray-400">{user?.username}</p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {success && (
                    <div className="mb-4 p-4 rounded-lg"
                        style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e' }}>
                        User berhasil diperbarui!
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 rounded-lg"
                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="rounded-2xl p-6 shadow-2xl space-y-4"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#ffffff',
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#ffffff',
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                            Kelas
                        </label>
                        <input
                            type="text"
                            value={formData.class}
                            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#ffffff',
                            }}
                            placeholder="Contoh: XI"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                            Jurusan
                        </label>
                        <input
                            type="text"
                            value={formData.major}
                            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#ffffff',
                            }}
                            placeholder="Contoh: IPA 1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                            Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#ffffff',
                            }}
                        >
                            <option value="basic">Basic (User biasa)</option>
                            <option value="staff">Staff (Lihat admin panel)</option>
                            <option value="dev">Dev (Full access)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                            Password Baru (Kosongkan jika tidak diubah)
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#ffffff',
                            }}
                            placeholder="Masukkan password baru (opsional)"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        style={{
                            background: saving ? '#999' : '#ebae3b',
                            color: '#0d1216',
                        }}
                    >
                        <FaSave />
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </form>

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
    );
}

export default function EditUserPage() {
    return (
        <AuthProvider>
            <EditUserContent />
        </AuthProvider>
    );
}
