// import { FaUserShield } from 'react-icons/fa';

export default function TasisLoader({ message = 'Loading...' }) {
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
            <p className="text-sm font-bold" style={{ color: '#ebae3b' }}>{message}</p> */}
        </div>
    );
}
