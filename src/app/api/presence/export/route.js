import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json(
                { success: false, error: 'Token tidak valid' },
                { status: 401 }
            );
        }

        if (decoded.role === 'basic') {
            return NextResponse.json(
                { success: false, error: 'Tidak memiliki akses' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1));
        const year = parseInt(searchParams.get('year') || new Date().getFullYear());

        const client = await clientPromise;
        const db = client.db('tasis_presence');

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const query = {
            timestamp: {
                $gte: startDate,
                $lte: endDate,
            },
        };

        const presences = await db.collection('presences')
            .find(query)
            .sort({ timestamp: -1 })
            .toArray();

        const userIds = [...new Set(presences.map(p => p.username))];
        const users = await db.collection('users')
            .find({ username: { $in: userIds } })
            .toArray();

        const userMap = {};
        users.forEach(u => {
            userMap[u.username] = u;
        });

        const headers = [
            'No',
            'Tanggal',
            'Waktu',
            'Username',
            'Nama',
            'Kelas',
            'Jurusan',
            'Jenis Piket',
            'Area',
            'Status',
            'Alasan Terlambat',
            'Latitude',
            'Longitude',
            'Link Foto'
        ];

        const rows = presences.map((p, index) => {
            const user = userMap[p.username] || {};
            const timestamp = new Date(p.timestamp);
            const jakartaTime = new Date(timestamp.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

            return [
                index + 1,
                jakartaTime.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                jakartaTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                p.username || '',
                user.name || '',
                user.class || '',
                user.major || '',
                p.picketType || '',
                p.area || '',
                p.status || '',
                p.lateNotes || '',
                p.location?.latitude || '',
                p.location?.longitude || '',
                p.imageUrl || ''
            ];
        });

        const escapeCSV = (value) => {
            if (value === null || value === undefined) return '';
            const strValue = String(value);
            if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
                return `"${strValue.replace(/"/g, '""')}"`;
            }
            return strValue;
        };

        const csvContent = [
            headers.map(escapeCSV).join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\n');

        const bom = '\uFEFF';
        const csvWithBom = bom + csvContent;

        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        return new Response(csvWithBom, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="Rekap_Presensi_${monthNames[month - 1]}_${year}.csv"`,
            },
        });

    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json(
            { success: false, error: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}
