"use client";

import { useEffect, useState } from "react";

export default function AdblockGuard() {
    const [blocked, setBlocked] = useState(false);

    useEffect(() => {
        let mounted = true;
        let bait = null;
        let testScript = null;
        let scriptTimedOut = false;

        const createBait = () => {
            try {
                bait = document.createElement("div");
                bait.className = "adsbox ad-banner ad-container pub_300x250";
                bait.style.cssText = "width:1px !important; height:1px !important; position:fixed !important; left:-9999px !important; top:-9999px !important;";
                document.body.appendChild(bait);
            } catch (e) {
                bait = null;
            }
        };

        const checkBait = () => {
            if (!bait) return false;
            try {
                const computed = window.getComputedStyle(bait);
                if (computed && (computed.display === "none" || computed.visibility === "hidden")) return true;
                if (!bait.offsetParent || bait.offsetHeight === 0 || bait.offsetWidth === 0) return true;
            } catch (e) {
                return false;
            }
            return false;
        };

        const testScriptUrl = "https://pl28316934.effectivegatecpm.com/b0/04/76/b00476d5b885cedd5d97e09951b1af49.js";

        const testRemoteScript = () => {
            return new Promise((resolve) => {
                try {
                    testScript = document.createElement("script");
                    testScript.src = testScriptUrl + "?r=" + Date.now();
                    testScript.async = true;
                    let done = false;

                    const cleanup = () => {
                        if (testScript && testScript.parentNode) testScript.parentNode.removeChild(testScript);
                        testScript = null;
                    };

                    testScript.onload = () => {
                        if (done) return;
                        done = true;
                        cleanup();
                        resolve(false); 
                    };

                    testScript.onerror = () => {
                        if (done) return;
                        done = true;
                        cleanup();
                        resolve(true); 
                    };

                    const to = setTimeout(() => {
                        if (done) return;
                        done = true;
                        scriptTimedOut = true;
                        cleanup();
                        resolve(true);
                    }, 1800);

                    document.body.appendChild(testScript);
                } catch (e) {
                    resolve(true);
                }
            });
        };

        (async () => {
            createBait();

            await new Promise((r) => setTimeout(r, 50));

            const baitBlocked = checkBait();

            const scriptBlocked = await testRemoteScript();

            if (!mounted) return;

            if (baitBlocked || scriptBlocked) {
                setBlocked(true);
            }

            try {
                if (bait && bait.parentNode) bait.parentNode.removeChild(bait);
            } catch (e) { }
            bait = null;
        })();

        return () => {
            mounted = false;
            try {
                if (bait && bait.parentNode) bait.parentNode.removeChild(bait);
            } catch (e) { }
            try {
                if (testScript && testScript.parentNode) testScript.parentNode.removeChild(testScript);
            } catch (e) { }
        };
    }, []);

    if (!blocked) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                background: 'rgba(13, 18, 22, 0.98)',
                backdropFilter: 'blur(10px)',
                pointerEvents: 'auto',
            }}
        >
            <div
                className="text-center max-w-lg rounded-2xl p-8"
                style={{ background: 'rgba(26, 35, 50, 0.98)', border: '2px solid #ebae3b' }}
            >
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7v6c0 5 4 9 10 9s10-4 10-9V7l-10-5z" fill="#ebae3b" />
                            <path d="M9.5 9.5L14.5 14.5" stroke="#0d1216" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.5 9.5L9.5 14.5" stroke="#0d1216" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-black mb-4" style={{ color: '#ebae3b', textTransform: 'uppercase' }}>
                    Deteksi Adblock
                </h2>

                <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(235, 174, 59, 0.06)', border: '1px solid rgba(235, 174, 59, 0.18)' }}>
                    <p className="text-sm font-medium" style={{ color: '#e5e7eb' }}>
                        Kami mendeteksi bahwa Anda menggunakan pemblokir iklan atau fitur privasi yang memblokir
                        konten tertentu pada situs ini. Untuk menjaga fungsionalitas penuh dan pengalaman pengguna,
                        harap nonaktifkan pemblokir iklan untuk domain ini.
                    </p>
                </div>

                <p className="text-xs" style={{ color: '#9ca3af' }}>
                    TASIS - Tata Tertib Siswa
                </p>
            </div>
        </div>
    );
}
