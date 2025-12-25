'use client';

import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="max-h-[70vh] overflow-auto p-4 space-y-4 text-sm text-gray-200">
            <h2 className="text-lg font-bold" style={{ color: '#ebae3b' }}>Kebijakan Privasi</h2>
            <p className="text-xs text-gray-400">Website Presensi Piket Harian TASIS<br />SMKN 2 Depok Sleman<br />Terakhir diperbarui: 25 Desember 2025</p>

            <p>Website Presensi Piket Harian TASIS SMKN 2 Depok Sleman (“Website”) dikelola untuk mendukung kegiatan presensi piket harian anggota TASIS (Tata Tertib Siswa). Kami berkomitmen untuk melindungi data pribadi pengguna sesuai peraturan perundang-undangan yang berlaku di Indonesia.</p>

            <h3 className="font-semibold">1. Data yang Kami Kumpulkan</h3>
            <p className="font-medium">a. Data Akun Pengguna (Disediakan oleh Pengembang)</p>
            <ul className="list-disc ml-5">
                <li>Nama lengkap</li>
                <li>Kelas</li>
                <li>Jurusan</li>
                <li>Informasi akun login</li>
            </ul>

            <p className="font-medium">b. Data Presensi Piket</p>
            <p>Saat pengguna melakukan presensi, kami mengumpulkan:</p>
            <ul className="list-disc ml-5">
                <li>Jenis piket</li>
                <li>Waktu dan tanggal presensi</li>
                <li>Foto saat pelaksanaan piket</li>
                <li>Lokasi geografis (GPS latitude & longitude)</li>
                <li>Informasi perangkat (user agent, sistem operasi, model perangkat)</li>
                <li>Alamat IP publik (ISP)</li>
            </ul>

            <p className="font-medium">c. Data Teknis Tambahan</p>
            <ul className="list-disc ml-5">
                <li>Log aktivitas sistem</li>
                <li>Cookie dan teknologi serupa untuk fungsi website dan iklan</li>
            </ul>

            <h3 className="font-semibold">2. Penggunaan Kamera dan Lokasi Perangkat</h3>
            <p>Untuk keperluan verifikasi presensi, Website memerlukan:</p>
            <ul className="list-disc ml-5">
                <li>Izin akses kamera</li>
                <li>Izin akses lokasi (GPS)</li>
            </ul>
            <p><strong>Ketentuan akses:</strong></p>
            <ul className="list-disc ml-5">
                <li>Akses hanya dilakukan saat proses presensi</li>
                <li>Tidak ada perekaman video atau audio</li>
                <li>Tidak ada pelacakan lokasi secara real-time di luar presensi</li>
                <li>Semua akses mengikuti mekanisme izin resmi browser</li>
            </ul>
            <p>Jika izin kamera atau lokasi ditolak, presensi tidak dapat dilakukan.</p>

            <h3 className="font-semibold">3. Tujuan Penggunaan Data</h3>
            <ul className="list-disc ml-5">
                <li>Pencatatan dan verifikasi presensi piket harian</li>
                <li>Monitoring dan evaluasi kinerja piket</li>
                <li>Rekapitulasi data secara real-time</li>
                <li>Sinkronisasi data ke spreadsheet administrasi</li>
                <li>Keamanan sistem dan pencegahan kecurangan</li>
            </ul>

            <h3 className="font-semibold">4. Penyimpanan dan Keamanan Data</h3>
            <ul className="list-disc ml-5">
                <li>Data presensi disimpan dalam database sistem</li>
                <li>Foto presensi disimpan di Google Drive</li>
                <li>Akses data dibatasi berdasarkan peran pengguna</li>
                <li>Kami menerapkan pengamanan teknis yang wajar</li>
                <li>Namun, tidak ada sistem elektronik yang sepenuhnya bebas risiko.</li>
            </ul>

            <h3 className="font-semibold">5. Akses dan Pengelolaan Data</h3>
            <p><strong>Hak Akses:</strong></p>
            <ul className="list-disc ml-5">
                <li>Pengguna: melihat data presensi miliknya sendiri</li>
                <li>Staf TASIS: melihat seluruh data presensi dan data pengguna</li>
                <li>Pengembang: memiliki hak penuh pengelolaan sistem dan data</li>
            </ul>
            <p><strong>Hak Perubahan:</strong> Perubahan data presensi dan data pengguna hanya dapat dilakukan oleh Pengembang</p>

            <h3 className="font-semibold">6. Iklan dan Pihak Ketiga</h3>
            <p>Website ini menampilkan iklan untuk mendukung biaya perawatan sistem. Kami menggunakan layanan iklan pihak ketiga seperti Adsterra, yang dapat mengumpulkan data secara mandiri dan melakukan personalisasi iklan berdasarkan aktivitas pengguna. Konten iklan sepenuhnya menjadi tanggung jawab penyedia iklan.</p>

            <h3 className="font-semibold">7. Pembagian Data</h3>
            <p>Kami tidak menjual data pribadi pengguna. Data dapat dibagikan kepada:</p>
            <ul className="list-disc ml-5">
                <li>Staf dan pengelola internal TASIS</li>
                <li>Penyedia layanan pendukung sistem</li>
                <li>Pihak berwenang jika diwajibkan oleh hukum</li>
            </ul>

            <h3 className="font-semibold">8. Hak Pengguna</h3>
            <ul className="list-disc ml-5">
                <li>Mengetahui data yang dikumpulkan</li>
                <li>Meminta klarifikasi data presensi</li>
                <li>Mengajukan koreksi melalui staf atau developer</li>
            </ul>

            <h3 className="font-semibold">9. Dasar Hukum</h3>
            <p>Pengelolaan data pribadi mengacu pada Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP), Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (UU ITE) beserta perubahannya, dan Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik.</p>

            <h3 className="font-semibold">10. Perubahan Kebijakan</h3>
            <p>Kebijakan ini dapat diperbarui sewaktu-waktu dan akan diumumkan melalui Website.</p>

            <h3 className="font-semibold">11. Kontak</h3>
            <p>Untuk pertanyaan terkait privasi data, silakan hubungi staf/pengembang Website Presensi TASIS SMKN 2 Depok Sleman. Informasi kontak staf bisa dicari di grup Tim Tasis Pandhawa 25/26. Informasi kontak pengembang bisa melalui email abim@rejaka.id</p>
        </div>
    );
}
