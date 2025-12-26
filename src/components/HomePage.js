'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
    FaCamera, FaMapMarkerAlt, FaClock, FaCheckCircle,
    FaUser, FaSignOutAlt, FaUserCircle, FaChevronDown,
    FaHistory, FaFilter, FaUserShield, FaExclamationTriangle,
    FaSpinner, FaMobile, FaDesktop, FaExclamationCircle,
    FaCalendarAlt
} from 'react-icons/fa';
import { MdCameraswitch } from "react-icons/md";
import { RiCameraOffFill } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsAndService from '@/components/TermsAndService';

function TasisLoader() {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-transparent animate-spin"
                    style={{
                        borderTopColor: '#ebae3b',
                        borderRightColor: '#ebae3b',
                        borderBottomColor: 'transparent',
                        borderLeftColor: 'transparent',
                    }} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/logo.svg" alt="Logo" style={{ width: '4rem', height: '4rem' }} />
                </div>
            </div>
            {/* <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#ebae3b', animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#ebae3b', animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#ebae3b', animationDelay: '300ms' }} />
            </div>
            <p className="text-sm font-bold" style={{ color: '#ebae3b' }}>Loading...</p> */}
        </div>
    );
}

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
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
            style={{ background: 'rgba(13, 18, 22, 0.98)', backdropFilter: 'blur(10px)', zIndex: 10001 }}>
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

function UserDropdown({ user, onNavigate, onLogout }) {
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
                                            'rgba(75, 85, 99, 0.3)',
                                    border: `1px solid ${user.role === 'dev' ? '#a78bfa' :
                                        user.role === 'staff' ? '#60a5fa' : '#9ca3af'}`
                                }}>
                                <FaUserShield style={{
                                    color: user.role === 'dev' ? '#a78bfa' :
                                        user.role === 'staff' ? '#60a5fa' : '#9ca3af'
                                }} />
                                <span className="font-black text-xs" style={{
                                    color: user.role === 'dev' ? '#a78bfa' :
                                        user.role === 'staff' ? '#60a5fa' : '#9ca3af'
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

                        {(user.role === 'staff' || user.role === 'dev') && (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onNavigate('/admin');
                                }}
                                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-all font-semibold"
                                style={{ color: '#ebae3b', background: 'transparent' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(235, 174, 59, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <FaUserShield />
                                Admin Panel
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

function CurrentTime() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
            setTime(jakartaTime.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl"
            style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
            <FaClock style={{ color: '#ebae3b' }} size={18} />
            <span className="font-mono font-bold text-base" style={{ color: '#ebae3b' }}>
                {time}
            </span>
        </div>
    );
}

export default function HomePage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [picketType, setPicketType] = useState('choose');
    const [area, setArea] = useState('');
    const [lateNotes, setLateNotes] = useState('');
    const [location, setLocation] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [presences, setPresences] = useState([]);
    const [loadingPresences, setLoadingPresences] = useState(true);
    const [facingMode, setFacingMode] = useState('user');
    const [availableCameras, setAvailableCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('');
    const [showCameraSelector, setShowCameraSelector] = useState(false);
    const [includeLocation, setIncludeLocation] = useState(true);
    const [includeDeviceInfo, setIncludeDeviceInfo] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    const [historyFilter, setHistoryFilter] = useState({
        picketType: 'all',
        month: '',
        year: new Date().getFullYear().toString(),
    });
    const [showHistoryFilter, setShowHistoryFilter] = useState(false);

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        if (user) {
            checkDefaultPicketType();
            getLocation();
            fetchPresences();
            enumerateCameras();
        }
    }, [user]);

    const enumerateCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setAvailableCameras(videoDevices);

            const realCamera = videoDevices.find(device =>
                !device.label.toLowerCase().includes('virtual') &&
                !device.label.toLowerCase().includes('obs')
            );

            if (realCamera) {
                setSelectedCamera(realCamera.deviceId);
            } else if (videoDevices.length > 0) {
                setSelectedCamera(videoDevices[0].deviceId);
            }
        } catch (error) {
            console.error('Error enumerating cameras:', error);
        }
    };

    const checkDefaultPicketType = () => {
        const now = new Date();
        const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
        const hours = jakartaTime.getHours();
        const minutes = jakartaTime.getMinutes();

        if ((hours >= 4 && hours < 6) || (hours === 6 && minutes <= 55)) {
            setPicketType('Piket Pagi');
        } else if ((hours === 12 && minutes >= 30) || (hours > 12 && hours < 18) || hours === 18) {
            setPicketType('Piket Sore');
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    };

    const fetchPresences = async () => {
        try {
            const token = localStorage.getItem('tasis_token');
            const response = await fetch('/api/presence/list', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPresences(data.presences);
            }
        } catch (error) {
            console.error('Error fetching presences:', error);
        } finally {
            setLoadingPresences(false);
        }
    };

    const startCamera = async () => {
        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }

            setShowCamera(true);
            setError('');

            await new Promise(resolve => setTimeout(resolve, 100));

            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            const constraints = {
                video: selectedCamera ? {
                    deviceId: { exact: selectedCamera },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                } : {
                    facingMode: facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false
            };

            console.log('Requesting camera with constraints:', constraints);
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('Camera stream obtained:', stream.getTracks());
            console.log('Video track settings:', stream.getVideoTracks()[0].getSettings());

            let retries = 0;
            while (!videoRef.current && retries < 10) {
                await new Promise(resolve => setTimeout(resolve, 100));
                retries++;
            }

            if (!videoRef.current) {
                throw new Error('Video element not available after waiting');
            }

            streamRef.current = stream;

            videoRef.current.srcObject = stream;

            await new Promise((resolve, reject) => {
                const video = videoRef.current;
                if (!video) {
                    reject(new Error('Video element lost'));
                    return;
                }

                const timeoutId = setTimeout(() => {
                    reject(new Error('Video load timeout'));
                }, 10000);

                video.onloadedmetadata = async () => {
                    console.log('Video metadata loaded:', {
                        videoWidth: video.videoWidth,
                        videoHeight: video.videoHeight,
                        readyState: video.readyState
                    });

                    clearTimeout(timeoutId);

                    try {
                        await video.play();
                        console.log('Video playing successfully');
                        resolve();
                    } catch (playError) {
                        console.error('Play error:', playError);
                        reject(playError);
                    }
                };

                video.onerror = (err) => {
                    console.error('Video element error:', err);
                    clearTimeout(timeoutId);
                    reject(err);
                };
            });
        } catch (error) {
            console.error('Error accessing camera:', error);

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }

            let errorMessage = 'Tidak dapat mengakses kamera';
            if (error.name === 'NotAllowedError') {
                errorMessage = 'Akses kamera ditolak. Mohon izinkan akses kamera.';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'Kamera tidak ditemukan';
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'Kamera sedang digunakan aplikasi lain';
            } else if (error.message) {
                errorMessage = `${errorMessage}: ${error.message}`;
            }

            setError(errorMessage);
            setShowCamera(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setShowCamera(false);
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0);

            canvas.toBlob((blob) => {
                setCapturedImage(blob);
                stopCamera();
            }, 'image/jpeg', 0.8);
        }
    };

    const switchCamera = async () => {
        if (availableCameras.length > 1) {
            const currentIndex = availableCameras.findIndex(cam => cam.deviceId === selectedCamera);
            const nextIndex = (currentIndex + 1) % availableCameras.length;
            setSelectedCamera(availableCameras[nextIndex].deviceId);

            stopCamera();
            setTimeout(() => startCamera(), 100);
        } else {
            stopCamera();
            setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
            setTimeout(() => startCamera(), 100);
        }
    };

    const isLate = () => {
        const now = new Date();
        const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
        const hours = jakartaTime.getHours();
        const minutes = jakartaTime.getMinutes();

        if (picketType === 'Piket Pagi') {
            return hours > 6 || (hours === 6 && minutes > 55);
        }

        if (picketType === 'Piket Sore') {
            return hours > 18;
        }

        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!capturedImage) {
            setError('Foto wajib diambil');
            return;
        }

        if (picketType === 'choose') {
            setError('Pilih jenis piket');
            return;
        }

        if (picketType === 'Piket Pagi' && !area) {
            setError('Area wajib dipilih untuk Piket Pagi');
            return;
        }

        const late = isLate();
        if (late && !lateNotes) {
            setError('Alasan terlambat wajib diisi');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const formData = new FormData();

            const now = new Date();
            const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

            const dateStr = jakartaTime.toISOString().split('T')[0].replace(/-/g, '');
            const timeStr = jakartaTime.toTimeString().split(' ')[0].replace(/:/g, '');
            const picketTypeFormatted = picketType.replace(/ /g, '-');
            const fileName = `${user.username}-${dateStr}-${timeStr}-${picketTypeFormatted}.jpg`;

            const locationToSend = (user && user.role === 'dev' && includeLocation === false) ? null : location;

            if (!(user && user.role === 'dev') && !locationToSend) {
                setError('Lokasi wajib');
                setSubmitting(false);
                return;
            }

            const presenceData = {
                picketType,
                area: picketType === 'Piket Pagi' ? area : null,
                timestamp: now.toISOString(),
                location: locationToSend,
                status: late ? 'Terlambat' : 'Tepat Waktu',
                lateNotes: late ? lateNotes : null,
                fileName,
                deviceInfo: (user && user.role === 'dev' && !includeDeviceInfo) ? null : {
                    userAgent: typeof navigator !== 'undefined' ? (navigator.userAgent || null) : null,
                    platform: typeof navigator !== 'undefined' ? (navigator.platform || null) : null,
                    languages: typeof navigator !== 'undefined' ? (navigator.languages ? navigator.languages.join(', ') : (navigator.language || null)) : null,
                    deviceMemory: typeof navigator !== 'undefined' ? (navigator.deviceMemory || null) : null,
                    hardwareConcurrency: typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || null) : null,
                    maxTouchPoints: typeof navigator !== 'undefined' ? (navigator.maxTouchPoints || null) : null,
                    vendor: typeof navigator !== 'undefined' ? (navigator.vendor || null) : null,
                }
            };

            formData.append('presenceData', JSON.stringify(presenceData));
            formData.append('image', capturedImage, fileName);

            const token = localStorage.getItem('tasis_token');
            const response = await fetch('/api/presence/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setCapturedImage(null);
                setArea('');
                setLateNotes('');
                checkDefaultPicketType();
                fetchPresences();

                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            } else {
                setError(data.message || 'Gagal mengirim presensi');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setError('Terjadi kesalahan');
        } finally {
            setSubmitting(false);
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

    return (
        <>
            <MobileWarning />

            <div className="min-h-screen pb-20"
                style={{ background: 'linear-gradient(135deg, #0d1216 0%, #1a2332 100%)' }}>
                {/* Header */}
                <div className="sticky top-0 z-50 px-4 py-5 border-b"
                    style={{
                        background: 'rgba(13, 18, 22, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderColor: 'rgba(235, 174, 59, 0.2)',
                        zIndex: 9999,
                    }}>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                            <Image src="/logo.svg" alt="TASIS" width={44} height={44} />
                            <div>
                                <h1 className="text-xl font-bold" style={{ color: '#ebae3b' }}>
                                    TASIS
                                </h1>
                                <p className="text-sm text-gray-400">Presensi Piket</p>
                            </div>
                        </div>
                        <UserDropdown
                            user={user}
                            onNavigate={router.push}
                            onLogout={logout}
                        />
                    </div>
                    <>
                        <CurrentTime />
                    </>
                </div>

                <script async="async" data-cfasync="false" src="https://passivealexis.com/487e52acb339c3a0ec406d9715d6faa1/invoke.js"></script>
                <div id="container-487e52acb339c3a0ec406d9715d6faa1" style={{ position: 'relative', zIndex: 0 }} />

                <div className="px-4 py-6 space-y-8">
                    {/* Success Message */}
                    {success && (
                        <div className="p-4 rounded-lg flex items-center gap-3"
                            style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                            <FaCheckCircle style={{ color: '#22c55e' }} size={24} />
                            <span style={{ color: '#22c55e' }}>
                                Presensi berhasil disimpan!
                            </span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 rounded-lg"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                            {error}
                        </div>
                    )}

                    {/* Presence Form */}
                    <div className="rounded-2xl px-5 py-6 shadow-2xl"
                        style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: '#ebae3b' }}>
                            <FaCamera size={22} />
                            Input Presensi
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Picket Type */}
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                                    Jenis Piket <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <select
                                    value={picketType}
                                    onChange={(e) => {
                                        setPicketType(e.target.value);
                                        if (e.target.value === 'Piket Sore') {
                                            setArea('');
                                        }
                                    }}
                                    required
                                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff',
                                    }}
                                >
                                    <option value="choose" style={{ background: '#1a2332', color: '#ffffff' }}>Pilih Jenis Piket</option>
                                    <option value="Piket Pagi" style={{ background: '#1a2332', color: '#ffffff' }}>Piket Pagi</option>
                                    <option value="Piket Sore" style={{ background: '#1a2332', color: '#ffffff' }}>Piket Sore</option>
                                </select>
                            </div>

                            {/* Area (only for Piket Pagi) */}
                            {picketType === 'Piket Pagi' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                                        Area <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <select
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#ffffff',
                                        }}
                                    >
                                        <option value="" style={{ background: '#1a2332', color: '#ffffff' }}>Pilih Area</option>
                                        <option value="Bangki" style={{ background: '#1a2332', color: '#ffffff' }}>Bangki</option>
                                        <option value="Gerbang Kandang" style={{ background: '#1a2332', color: '#ffffff' }}>Gerbang Kandang</option>
                                        <option value="Pintu Selatan Bima" style={{ background: '#1a2332', color: '#ffffff' }}>Pintu Selatan Bima</option>
                                        <option value="Gerbang Utara" style={{ background: '#1a2332', color: '#ffffff' }}>Gerbang Utara (Deket Pos Satpam)</option>
                                        <option value="Gerbang Rutor" style={{ background: '#1a2332', color: '#ffffff' }}>Gerbang Rutor (Samping Parkiran Guru Utara)</option>
                                    </select>
                                </div>
                            )}

                            {/* Late Notes */}
                            {isLate() && (
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#ef4444' }}>
                                        Alasan Terlambat <span>*</span>
                                    </label>
                                    <textarea
                                        value={lateNotes}
                                        onChange={(e) => setLateNotes(e.target.value)}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            color: '#ffffff',
                                        }}
                                        placeholder="Jelaskan alasan keterlambatan..."
                                    />
                                </div>
                            )}

                            {/* Location Info */}
                            {user && user.role === 'dev' ? (
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-4 items-center justify-between">
                                        <p className="text-sm font-medium" style={{ color: '#e5e7eb' }}>Preferensi Dev</p>
                                        <div className="flex flex-row items-center gap-2 text-sm">
                                            <button
                                                type="button"
                                                onClick={() => setIncludeLocation(v => !v)}
                                                className={`px-3 py-1 max-w-48 rounded-full font-semibold transition-all flex items-center gap-2 ${includeLocation ? '' : 'opacity-60'}`}
                                                style={{
                                                    background: includeLocation ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                                    color: includeLocation ? '#60a5fa' : '#9ca3af',
                                                    border: includeLocation ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(255,255,255,0.04)'
                                                }}
                                            >
                                                <span style={{ fontSize: 12 }}>{includeLocation ? '✓' : '○'}</span>
                                                <span>Data Lokasi</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setIncludeDeviceInfo(v => !v)}
                                                className={`px-3 py-1 max-w-48 rounded-full font-semibold transition-all flex items-center gap-2 ${includeDeviceInfo ? '' : 'opacity-60'}`}
                                                style={{
                                                    background: includeDeviceInfo ? 'rgba(235,174,59,0.12)' : 'transparent',
                                                    color: includeDeviceInfo ? '#ebae3b' : '#9ca3af',
                                                    border: includeDeviceInfo ? '1px solid rgba(235,174,59,0.18)' : '1px solid rgba(255,255,255,0.04)'
                                                }}
                                            >
                                                <span style={{ fontSize: 12 }}>{includeDeviceInfo ? '✓' : '○'}</span>
                                                <span>Info Perangkat</span>
                                            </button>
                                        </div>
                                    </div>

                                    {includeLocation ? (
                                        <div className="p-3 rounded-lg flex items-start gap-2 text-sm"
                                            style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                                            <FaMapMarkerAlt style={{ color: '#60a5fa' }} className="mt-0.5" />
                                            <div>
                                                <p style={{ color: '#60a5fa' }}>Lokasi</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 'Lokasi belum terdeteksi'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                            <p className="text-xs text-gray-400">Lokasi tidak disertakan untuk pengiriman ini.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {location ? (
                                        <div className="p-3 rounded-lg flex items-start gap-2 text-sm"
                                            style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                                            <FaMapMarkerAlt style={{ color: '#60a5fa' }} className="mt-0.5" />
                                            <div>
                                                <p style={{ color: '#60a5fa' }}>Lokasi terdeteksi</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                            <p className="text-xs text-gray-400">Lokasi belum terdeteksi. Mohon izinkan akses lokasi atau tekan tombol deteksi.</p>
                                            <div className="mt-2">
                                                <button type="button" onClick={getLocation} className="px-3 py-1 rounded-lg" style={{ background: 'rgba(235, 174, 59, 0.1)', color: '#ebae3b' }}>Deteksi Lokasi</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Camera */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium" style={{ color: '#e5e7eb' }}>
                                        Foto <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    {availableCameras.length > 1 && !capturedImage && (
                                        <button
                                            type="button"
                                            onClick={() => setShowCameraSelector(!showCameraSelector)}
                                            className="text-xs font-medium px-3 py-1 rounded-lg transition-all"
                                            style={{
                                                background: 'rgba(235, 174, 59, 0.1)',
                                                color: '#ebae3b',
                                                border: '1px solid rgba(235, 174, 59, 0.3)'
                                            }}
                                        >
                                            {showCameraSelector ? 'Tutup' : `Pilih Kamera (${availableCameras.length})`}
                                        </button>
                                    )}
                                </div>

                                {/* Camera Selector */}
                                {showCameraSelector && availableCameras.length > 1 && (
                                    <div className="mb-3 p-3 rounded-lg space-y-2"
                                        style={{ background: 'rgba(235, 174, 59, 0.05)', border: '1px solid rgba(235, 174, 59, 0.2)' }}>
                                        <p className="text-xs font-semibold mb-2" style={{ color: '#ebae3b' }}>PILIH KAMERA:</p>
                                        {availableCameras.map((camera, index) => (
                                            <button
                                                key={camera.deviceId}
                                                type="button"
                                                onClick={async () => {
                                                    setSelectedCamera(camera.deviceId);
                                                    setShowCameraSelector(false);
                                                    if (showCamera) {
                                                        await startCamera();
                                                    }
                                                }}
                                                className="w-full text-left px-3 py-2 rounded transition-all text-sm"
                                                style={{
                                                    background: selectedCamera === camera.deviceId ? 'rgba(235, 174, 59, 0.2)' : 'transparent',
                                                    color: selectedCamera === camera.deviceId ? '#ebae3b' : '#e5e7eb',
                                                    border: `1px solid ${selectedCamera === camera.deviceId ? '#ebae3b' : 'transparent'}`
                                                }}
                                            >
                                                <FaCamera className="inline mr-2" size={12} />
                                                {camera.label || `Kamera ${index + 1}`}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {!showCamera && !capturedImage && (
                                    <button
                                        type="button"
                                        onClick={startCamera}
                                        className="w-full py-12 rounded-lg border-2 border-dashed transition-all flex flex-col items-center gap-3"
                                        style={{
                                            borderColor: 'rgba(235, 174, 59, 0.3)',
                                            background: 'rgba(235, 174, 59, 0.05)',
                                        }}
                                    >
                                        <FaCamera style={{ color: '#ebae3b' }} size={32} />
                                        <span style={{ color: '#ebae3b' }} className="font-medium">
                                            Buka Kamera
                                        </span>
                                    </button>
                                )}

                                {showCamera && (
                                    <div className="space-y-3">
                                        <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: '300px' }}>
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover"
                                                style={{
                                                    display: 'block',
                                                    backgroundColor: '#000',
                                                    minHeight: '300px'
                                                }}
                                            />
                                        </div>

                                        {/* Camera info */}
                                        {selectedCamera && availableCameras.length > 0 && (
                                            <div className="text-xs text-center" style={{ color: '#9ca3af' }}>
                                                <FaCamera className="inline mr-1" size={10} />
                                                {availableCameras.find(c => c.deviceId === selectedCamera)?.label || 'Kamera Aktif'}
                                            </div>
                                        )}

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={capturePhoto}
                                                className="flex-1 py-3 rounded-lg font-semibold transition-all"
                                                style={{ background: '#ebae3b', color: '#0d1216' }}
                                            >
                                                Ambil Foto
                                            </button>
                                            <button
                                                type="button"
                                                onClick={switchCamera}
                                                className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center"
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    color: '#ebae3b',
                                                }}
                                            >
                                                <MdCameraswitch size={20} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={stopCamera}
                                                className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center"
                                                style={{
                                                    background: 'rgba(239, 68, 68, 0.2)',
                                                    color: '#ef4444',
                                                }}
                                            >
                                                <RiCameraOffFill size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {capturedImage && (
                                    <div className="space-y-3">
                                        <img
                                            src={URL.createObjectURL(capturedImage)}
                                            alt="Captured"
                                            className="w-full rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCapturedImage(null);
                                                startCamera();
                                            }}
                                            className="w-full py-3 rounded-lg font-semibold transition-all"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                color: '#ebae3b',
                                            }}
                                        >
                                            Ambil Ulang
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting || !capturedImage || picketType === 'choose'}
                                className="w-full py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50"
                                style={{
                                    background: submitting ? '#999' : '#ebae3b',
                                    color: '#0d1216',
                                }}
                            >
                                {submitting ? 'Mengirim...' : 'Kirim Presensi'}
                            </button>
                        </form>
                    </div>

                    {/* Presence History */}
                    <div className="rounded-2xl px-5 py-6 shadow-2xl"
                        style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-3" style={{ color: '#ebae3b' }}>
                                <FaHistory size={22} />
                                Riwayat Presensi
                            </h2>
                            <button
                                onClick={() => setShowHistoryFilter(!showHistoryFilter)}
                                className="px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                                style={{
                                    background: showHistoryFilter ? '#ebae3b' : 'rgba(235, 174, 59, 0.1)',
                                    color: showHistoryFilter ? '#0d1216' : '#ebae3b',
                                    border: '1px solid rgba(235, 174, 59, 0.3)',
                                }}
                            >
                                <FaFilter size={12} />
                                Filter
                            </button>
                        </div>

                        {/* Filter Panel */}
                        {showHistoryFilter && (
                            <div className="mb-4 p-4 rounded-xl space-y-3"
                                style={{ background: 'rgba(235, 174, 59, 0.05)', border: '1px solid rgba(235, 174, 59, 0.2)' }}>
                                <div className="grid grid-cols-3 gap-3">
                                    {/* Jenis Piket */}
                                    <select
                                        value={historyFilter.picketType}
                                        onChange={(e) => setHistoryFilter({ ...historyFilter, picketType: e.target.value })}
                                        className="px-3 py-2.5 rounded-lg text-sm"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#ffffff',
                                        }}
                                    >
                                        <option value="all" style={{ background: '#1a2332' }}>Semua</option>
                                        <option value="Piket Pagi" style={{ background: '#1a2332' }}>Pagi</option>
                                        <option value="Piket Sore" style={{ background: '#1a2332' }}>Sore</option>
                                    </select>

                                    {/* Bulan */}
                                    <select
                                        value={historyFilter.month}
                                        onChange={(e) => setHistoryFilter({ ...historyFilter, month: e.target.value })}
                                        className="px-3 py-2.5 rounded-lg text-sm"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#ffffff',
                                        }}
                                    >
                                        <option value="" style={{ background: '#1a2332' }}>Bulan</option>
                                        <option value="1" style={{ background: '#1a2332' }}>Jan</option>
                                        <option value="2" style={{ background: '#1a2332' }}>Feb</option>
                                        <option value="3" style={{ background: '#1a2332' }}>Mar</option>
                                        <option value="4" style={{ background: '#1a2332' }}>Apr</option>
                                        <option value="5" style={{ background: '#1a2332' }}>Mei</option>
                                        <option value="6" style={{ background: '#1a2332' }}>Jun</option>
                                        <option value="7" style={{ background: '#1a2332' }}>Jul</option>
                                        <option value="8" style={{ background: '#1a2332' }}>Agt</option>
                                        <option value="9" style={{ background: '#1a2332' }}>Sep</option>
                                        <option value="10" style={{ background: '#1a2332' }}>Okt</option>
                                        <option value="11" style={{ background: '#1a2332' }}>Nov</option>
                                        <option value="12" style={{ background: '#1a2332' }}>Des</option>
                                    </select>

                                    {/* Tahun */}
                                    <select
                                        value={historyFilter.year}
                                        onChange={(e) => setHistoryFilter({ ...historyFilter, year: e.target.value })}
                                        className="px-3 py-2.5 rounded-lg text-sm"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#ffffff',
                                        }}
                                    >
                                        <option value="" style={{ background: '#1a2332' }}>Tahun</option>
                                        <option value="2024" style={{ background: '#1a2332' }}>2024</option>
                                        <option value="2025" style={{ background: '#1a2332' }}>2025</option>
                                        <option value="2026" style={{ background: '#1a2332' }}>2026</option>
                                    </select>
                                </div>
                                <button
                                    onClick={() => setHistoryFilter({ picketType: 'all', month: '', year: '' })}
                                    className="w-full py-2 rounded-lg text-sm font-semibold transition-all"
                                    style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}

                        {loadingPresences ? (
                            <div className="flex justify-center py-10">
                                <FaSpinner className="animate-spin" style={{ color: '#ebae3b', fontSize: '2.5rem' }} />
                            </div>
                        ) : (() => {
                            const filteredPresences = presences.filter((p) => {
                                if (p.username !== user?.username) return false;

                                if (historyFilter.picketType !== 'all' && p.picketType !== historyFilter.picketType) {
                                    return false;
                                }
                                if (historyFilter.month || historyFilter.year) {
                                    const presenceDate = new Date(p.timestamp);
                                    if (historyFilter.month && (presenceDate.getMonth() + 1) !== parseInt(historyFilter.month)) {
                                        return false;
                                    }
                                    if (historyFilter.year && presenceDate.getFullYear() !== parseInt(historyFilter.year)) {
                                        return false;
                                    }
                                }
                                return true;
                            });

                            if (filteredPresences.length === 0) {
                                return <p className="text-center text-gray-400 py-8">Tidak ada data presensi</p>;
                            }

                            return (
                                <div className="space-y-4">
                                    {filteredPresences.map((presence) => (
                                        <button
                                            key={presence.id}
                                            onClick={() => router.push(`/presence/${presence.id}`)}
                                            className="w-full rounded-xl text-left transition-all active:scale-[0.98] overflow-hidden"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.06)',
                                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                            }}
                                        >
                                            {/* Status Badge - Full Width Top */}
                                            <div
                                                className="px-4 py-2 flex items-center justify-center gap-2"
                                                style={presence.status === 'Tepat Waktu'
                                                    ? { background: 'rgba(34, 197, 94, 0.2)' }
                                                    : { background: 'rgba(239, 68, 68, 0.2)' }
                                                }
                                            >
                                                <FaCheckCircle
                                                    size={14}
                                                    style={{ color: presence.status === 'Tepat Waktu' ? '#4ade80' : '#f87171' }}
                                                />
                                                <span
                                                    className="text-sm font-black uppercase tracking-wider"
                                                    style={{ color: presence.status === 'Tepat Waktu' ? '#4ade80' : '#f87171' }}
                                                >
                                                    {presence.status}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 space-y-3">
                                                {/* Piket Type */}
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                        style={{ background: 'rgba(235, 174, 59, 0.15)' }}
                                                    >
                                                        <FaClock size={18} style={{ color: '#ebae3b' }} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs uppercase tracking-wide" style={{ color: '#9ca3af' }}>Jenis Piket</p>
                                                        <p className="font-bold text-base" style={{ color: '#ebae3b' }}>
                                                            {presence.picketType}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Area - if exists */}
                                                {presence.area && (
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                            style={{ background: 'rgba(59, 130, 246, 0.15)' }}
                                                        >
                                                            <FaMapMarkerAlt size={18} style={{ color: '#60a5fa' }} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs uppercase tracking-wide" style={{ color: '#9ca3af' }}>Lokasi</p>
                                                            <p className="font-semibold text-sm" style={{ color: '#e5e7eb' }}>
                                                                {presence.area}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Timestamp */}
                                                <div
                                                    className="pt-3 border-t flex items-center justify-between"
                                                    style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                                                >
                                                    <p className="text-sm" style={{ color: '#6b7280' }}>
                                                        {new Date(presence.timestamp).toLocaleString('id-ID', {
                                                            timeZone: 'Asia/Jakarta',
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                    <p className="text-sm font-semibold" style={{ color: '#ebae3b' }}>
                                                        {new Date(presence.timestamp).toLocaleString('id-ID', {
                                                            timeZone: 'Asia/Jakarta',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>

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
