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

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = parseInt(searchParams.get('skip') || '0');
        const picketType = searchParams.get('picketType');
        const status = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const client = await clientPromise;
        const db = client.db('tasis_presence');

        const query = {};

        if (userId) {
            query.username = userId;
        } else if (decoded.role === 'basic') {
            query.username = decoded.username;
        }

        if (picketType && picketType !== 'all') {
            query.picketType = picketType;
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) {
                query.timestamp.$gte = new Date(startDate);
            }
            if (endDate) {
                query.timestamp.$lte = new Date(endDate);
            }
        }

        const presences = await db.collection('presences')
            .find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        const total = await db.collection('presences').countDocuments(query);

        const formattedPresences = presences.map(p => ({
            id: p._id.toString(),
            userId: p.userId.toString(),
            username: p.username,
            picketType: p.picketType,
            area: p.area,
            timestamp: p.timestamp.toISOString(),
            location: p.location,
            status: p.status,
            lateNotes: p.lateNotes,
            imageUrl: p.imageUrl,
        }));

        return NextResponse.json({
            success: true,
            presences: formattedPresences,
            total,
            hasMore: skip + limit < total,
        });
    } catch (error) {
        console.error('Get presences error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}
