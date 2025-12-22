import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

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

        if (decoded.role === 'basic') {
            return NextResponse.json(
                { success: false, message: 'Akses ditolak' },
                { status: 403 }
            );
        }

        const { id } = await params;

        const client = await clientPromise;
        const db = client.db('tasis_presence');

        const user = await db.collection('users').findOne(
            { _id: new ObjectId(id) },
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
        console.error('Get user detail error:', error);
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

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'User tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'User berhasil diperbarui',
        });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}
