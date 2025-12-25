'use client';

import React, { useState } from 'react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndService from './TermsAndService';
import Modal from './Modal';
import { FaTimes } from 'react-icons/fa';

export default function Footer() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('privacy');
    const glassStyle = {
        background: 'transparent'
    };

    return (
        <div style={glassStyle}>
            <footer className="w-full py-6 text-center" style={glassStyle}>
                <div className="max-w-screen-lg mx-auto px-4">
                    <div className="flex items-center justify-center flex-col sm:flex-row">
                        <div className="text-xs sm:text-sm" style={{ color: '#999' }}>
                            <button
                                onClick={() => { setType('privacy'); setOpen(true); }}
                                className="font-semibold hover:underline"
                                style={{ color: '#ebae3b' }}
                            >
                                Kebijakan Privasi
                            </button>
                            {' '}|{' '}
                            <button
                                onClick={() => { setType('terms'); setOpen(true); }}
                                className="font-semibold hover:underline"
                                style={{ color: '#ebae3b' }}
                            >
                                Syarat & Ketentuan
                            </button>
                        </div>

                        <div className="text-xs sm:text-sm font-bold" style={{ color: '#999' }}>
                            Created by{' '}
                            <a href="https://rejaka.id" target="_blank" rel="noopener noreferrer" className="font-black hover:underline" style={{ color: '#ebae3b' }}>rejaka.id</a>
                            {' '}for TASIS
                        </div>
                    </div>
                </div>
            </footer>

            <Modal open={open} onClose={() => setOpen(false)} title={type === 'privacy' ? 'Kebijakan Privasi' : 'Syarat & Ketentuan'}>
                {type === 'privacy' ? <PrivacyPolicy /> : <TermsAndService />}
            </Modal>
        </div>
    );
}
