import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Token tidak valid' },
                { status: 401 }
            );
        }

        if (decoded.role === 'basic') {
            return NextResponse.json(
                { success: false, message: 'Akses ditolak' },
                { status: 403 }
            );
        }

        const client = await clientPromise;
        const db = client.db('tasis_presence');

        const users = await db.collection('users')
            .find({}, { projection: { password: 0 } })
            .sort({ name: 1 })
            .toArray();

        const formattedUsers = users.map(u => ({
            id: u._id.toString(),
            username: u.username,
            name: u.name,
            class: u.class,
            major: u.major,
            role: u.role,
        }));

        return NextResponse.json({
            success: true,
            users: formattedUsers,
        });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}
