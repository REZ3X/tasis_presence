'use client';

import { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaUser, FaSpinner, FaDesktop, FaMobile, FaExclamationCircle } from 'react-icons/fa';
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

function PresenceDetailContent() {
    const { getToken } = useAuth();
    const params = useParams();
    const router = useRouter();
    const [presence, setPresence] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        fetchPresenceDetail();
    }, []);

    const fetchPresenceDetail = async () => {
        try {
            const token = getToken();
            const response = await fetch(`/api/presence/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Presence data:', data.presence);
                console.log('Image URL:', data.presence.imageUrl);
                setPresence(data.presence);
            }
        } catch (error) {
            console.error('Error fetching presence detail:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0d1216 0%, #1a2332 100%)' }}>
                <TasisLoader />
            </div>
        );
    }

    if (!presence) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4"
                style={{ background: 'linear-gradient(135deg, #0d1216 0%, #1a2332 100%)' }}>
                <div className="text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <p style={{ color: '#ef4444' }}>Presensi tidak ditemukan</p>
                </div>
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
                            onClick={() => router.back()}
                            className="p-2 rounded-lg transition-all"
                            style={{ background: 'rgba(235, 174, 59, 0.1)', color: '#ebae3b' }}
                        >
                            <FaArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold" style={{ color: '#ebae3b' }}>
                                Detail Presensi
                            </h1>
                            <p className="text-xs text-gray-400">ID: {presence.id.slice(-8)}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {/* Image */}
                    {presence.imageUrl && (() => {
                        let fileId = null;
                        const urlPatterns = [
                            /[?&]id=([^&]+)/,
                            /\/d\/([^/]+)/,
                            /\/file\/d\/([^/]+)/
                        ];

                        for (const pattern of urlPatterns) {
                            const match = presence.imageUrl.match(pattern);
                            if (match) {
                                fileId = match[1];
                                break;
                            }
                        }

                        const imageUrl = fileId ? `/api/image/${fileId}` : presence.imageUrl;

                        return (
                            <div className="rounded-2xl overflow-hidden shadow-2xl relative"
                                style={{ background: 'rgba(255, 255, 255, 0.05)', minHeight: imageLoading ? '200px' : 'auto' }}>
                                {/* Image Loading Spinner */}
                                {imageLoading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                                        style={{ background: 'rgba(13, 18, 22, 0.8)' }}>
                                        <FaSpinner className="animate-spin" style={{ color: '#ebae3b', fontSize: '2rem' }} />
                                        <p className="text-sm" style={{ color: '#ebae3b' }}>Memuat foto...</p>
                                    </div>
                                )}
                                <img
                                    src={imageUrl}
                                    alt="Foto Presensi"
                                    className="w-full"
                                    onLoad={() => setImageLoading(false)}
                                    onError={(e) => {
                                        setImageLoading(false);
                                        console.error('Image failed to load:', imageUrl);
                                        console.error('Original URL:', presence.imageUrl);
                                        e.target.style.display = 'none';
                                        const errorDiv = document.createElement('div');
                                        errorDiv.className = 'p-8 text-center';
                                        errorDiv.innerHTML = `
                                        <p style="color: #ef4444; margin-bottom: 8px;">Gagal memuat gambar</p>
                                        <a href="${presence.imageUrl}" target="_blank" rel="noopener noreferrer" 
                                           style="color: #ebae3b; text-decoration: underline; font-size: 12px;">
                                            Buka gambar di Google Drive
                                        </a>
                                    `;
                                        e.target.parentElement.appendChild(errorDiv);
                                    }}
                                    style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
                                />
                            </div>
                        );
                    })()}

                    {!presence.imageUrl && (
                        <div className="rounded-2xl p-8 text-center shadow-2xl"
                            style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                            <p style={{ color: '#9ca3af' }}>Tidak ada foto</p>
                        </div>
                    )}

                    {/* User Info */}
                    {presence.user && (
                        <div className="rounded-2xl p-6 shadow-2xl"
                            style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                            <h3 className="text-sm font-semibold mb-4 text-gray-400">
                                Informasi Pengguna
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500">Nama</p>
                                    <p className="font-semibold text-white">{presence.user.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Username</p>
                                    <p className="font-semibold text-white">{presence.username}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Kelas</p>
                                    <p className="font-semibold text-white">
                                        {presence.user.class} {presence.user.major}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Presence Info */}
                    <div className="rounded-2xl p-6 shadow-2xl"
                        style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                        <h3 className="text-sm font-semibold mb-4 text-gray-400">
                            Informasi Presensi
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500">Jenis Piket</p>
                                <p className="font-semibold" style={{ color: '#ebae3b' }}>
                                    {presence.picketType}
                                </p>
                            </div>

                            {presence.area && (
                                <div>
                                    <p className="text-xs text-gray-500">Area</p>
                                    <p className="font-semibold text-white flex items-center gap-2">
                                        <FaMapMarkerAlt style={{ color: '#60a5fa' }} />
                                        {presence.area}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-xs text-gray-500">Waktu</p>
                                <p className="font-semibold text-white flex items-center gap-2">
                                    <FaClock style={{ color: '#60a5fa' }} />
                                    {new Date(presence.timestamp).toLocaleString('id-ID', {
                                        timeZone: 'Asia/Jakarta',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Status</p>
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

                            {presence.lateNotes && (
                                <div>
                                    <p className="text-xs text-gray-500">Alasan Terlambat</p>
                                    <p className="font-medium text-white p-3 rounded-lg mt-1"
                                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                        {presence.lateNotes}
                                    </p>
                                </div>
                            )}

                            {presence.location && (
                                <div>
                                    <p className="text-xs text-gray-500">Koordinat Lokasi</p>
                                    <p className="font-mono text-sm text-white p-3 rounded-lg mt-1"
                                        style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                                        {presence.location.latitude.toFixed(6)}, {presence.location.longitude.toFixed(6)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <script async="async" data-cfasync="false" src="https://passivealexis.com/487e52acb339c3a0ec406d9715d6faa1/invoke.js"></script>
                    <div id="container-487e52acb339c3a0ec406d9715d6faa1" />

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

export default function PresenceDetailPage() {
    return (
        <AuthProvider>
            <PresenceDetailContent />
        </AuthProvider>
    );
}
