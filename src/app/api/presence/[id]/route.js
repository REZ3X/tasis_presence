import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
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

        const { id } = await params;

        const client = await clientPromise;
        const db = client.db('tasis_presence');

        const presence = await db.collection('presences').findOne({
            _id: new ObjectId(id)
        });

        if (!presence) {
            return NextResponse.json(
                { success: false, message: 'Presensi tidak ditemukan' },
                { status: 404 }
            );
        }

        if (decoded.role === 'basic' && presence.username !== decoded.username) {
            return NextResponse.json(
                { success: false, message: 'Akses ditolak' },
                { status: 403 }
            );
        }

        const user = await db.collection('users').findOne(
            { _id: presence.userId },
            { projection: { password: 0 } }
        );

        return NextResponse.json({
            success: true,
            presence: {
                id: presence._id.toString(),
                userId: presence.userId.toString(),
                username: presence.username,
                picketType: presence.picketType,
                area: presence.area,
                timestamp: presence.timestamp.toISOString(),
                location: presence.location,
                status: presence.status,
                lateNotes: presence.lateNotes,
                imageUrl: presence.imageUrl,
                user: user ? {
                    name: user.name,
                    class: user.class,
                    major: user.major,
                    role: user.role,
                } : null,
            },
        });
    } catch (error) {
        console.error('Get presence detail error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
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

        if (decoded.role !== 'dev') {
            return NextResponse.json(
                { success: false, message: 'Akses ditolak' },
                { status: 403 }
            );
        }

        const { id } = await params;

        const client = await clientPromise;
        const db = client.db('tasis_presence');

        const result = await db.collection('presences').deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'Presensi tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Presensi berhasil dihapus',
        });
    } catch (error) {
        console.error('Delete presence error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
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

        if (decoded.role !== 'dev') {
            return NextResponse.json(
                { success: false, message: 'Akses ditolak' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const updateData = await request.json();

        const client = await clientPromise;
        const db = client.db('tasis_presence');

        const result = await db.collection('presences').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'Presensi tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Presensi berhasil diperbarui',
        });
    } catch (error) {
        console.error('Update presence error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}
