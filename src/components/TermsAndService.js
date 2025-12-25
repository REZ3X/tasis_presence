'use client';

import React from 'react';

export default function TermsAndService() {
    return (
        <div className="max-h-[70vh] overflow-auto p-4 space-y-4 text-sm text-gray-200">
            <h2 className="text-lg font-bold" style={{ color: '#ebae3b' }}>Syarat & Ketentuan</h2>
            <p className="text-xs text-gray-400">Website Presensi Piket Harian TASIS<br />SMKN 2 Depok Sleman<br />Terakhir diperbarui: 25 Desember 2025</p>

            <p>Dengan menggunakan Website ini, pengguna dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan berikut.</p>

            <h3 className="font-semibold">1. Tujuan Website</h3>
            <p>Website ini merupakan sistem resmi presensi piket harian bagi anggota TASIS SMKN 2 Depok Sleman.</p>

            <h3 className="font-semibold">2. Akun Pengguna</h3>
            <ul className="list-disc ml-5">
                <li>Akun dibuat dan dikelola oleh admin</li>
                <li>Pengguna wajib menjaga kerahasiaan akun</li>
                <li>Segala aktivitas melalui akun menjadi tanggung jawab pemilik akun</li>
            </ul>

            <h3 className="font-semibold">3. Persyaratan Teknis Presensi</h3>
            <p>Untuk melakukan presensi, pengguna WAJIB:</p>
            <ul className="list-disc ml-5">
                <li>Mengaktifkan layanan lokasi (GPS)</li>
                <li>Memberikan izin akses kamera melalui browser</li>
                <li>Memberikan izin akses lokasi melalui browser</li>
                <li>Menggunakan perangkat dan browser yang mendukung</li>
                <li>Penolakan izin akan menyebabkan presensi gagal.</li>
            </ul>

            <h3 className="font-semibold">4. Kewajiban Pengguna</h3>
            <ul className="list-disc ml-5">
                <li>Melakukan presensi secara jujur</li>
                <li>Mengunggah foto asli saat piket</li>
                <li>Tidak memanipulasi lokasi, waktu, atau data</li>
                <li>Tidak menggunakan alat otomatis atau manipulasi sistem</li>
            </ul>

            <h3 className="font-semibold">5. Larangan</h3>
            <ul className="list-disc ml-5">
                <li>Memalsukan presensi</li>
                <li>Menggunakan foto milik orang lain</li>
                <li>Mengakses atau mencoba mengakses data tanpa izin</li>
                <li>Menggunakan Website di luar kepentingan kegiatan TASIS</li>
            </ul>

            <h3 className="font-semibold">6. Hak Pengelola</h3>
            <p>Pengelola berhak melakukan verifikasi dan koreksi data, menindak pelanggaran, serta mengubah atau mengembangkan sistem kapan saja.</p>

            <h3 className="font-semibold">7. Iklan</h3>
            <p>Website menampilkan iklan pihak ketiga untuk biaya operasional. Pengelola tidak bertanggung jawab atas isi iklan yang ditampilkan oleh pihak ketiga.</p>

            <h3 className="font-semibold">8. Batasan Tanggung Jawab</h3>
            <p>Pengelola tidak bertanggung jawab atas presensi gagal akibat penolakan izin perangkat, kesalahan akibat perangkat pengguna, atau gangguan teknis di luar kendali sistem.</p>

            <h3 className="font-semibold">9. Dasar Hukum</h3>
            <p>Ketentuan ini tunduk pada Undang-Undang Republik Indonesia dan peraturan perundang-undangan yang berlaku.</p>

            <h3 className="font-semibold">10. Perubahan Ketentuan</h3>
            <p>Syarat dan ketentuan dapat diperbarui sewaktu-waktu. Penggunaan berkelanjutan dianggap sebagai persetujuan.</p>
        </div>
    );
}
