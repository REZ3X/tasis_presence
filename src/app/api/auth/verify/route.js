import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'Token tidak valid' },
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

        const client = await clientPromise;
        const db = client.db('tasis_presence');

        const user = await db.collection('users').findOne(
            { _id: new ObjectId(decoded.id) },
            { projection: { password: 0 } }
        );

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                username: user.username,
                name: user.name,
                class: user.class,
                major: user.major,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}
