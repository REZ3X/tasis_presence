'use client';

import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function Modal({ open, onClose, title, children, className = '', style = {} }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 10050, ...style }}>
            <div className="absolute inset-0 bg-black/60" onClick={onClose} style={{ zIndex: 1 }} />
            <div className={`relative w-full max-w-2xl ${className} bg-[rgba(13,18,22,0.98)] rounded-2xl p-4 border`} style={{ zIndex: 2, borderColor: 'rgba(235,174,59,0.12)' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold" style={{ color: '#ebae3b' }}>{title}</h3>
                </div>

                <div className="max-h-[70vh] overflow-auto">
                    {children}
                </div>

                <div className="mt-4 text-right">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg" style={{ background: '#ebae3b', color: '#0d1216' }}>Tutup</button>
                </div>
            </div>
        </div>
    );
}
