import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
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

        const formDataPayload = await request.formData();
        const presenceData = JSON.parse(formDataPayload.get('presenceData'));
        const imageFile = formDataPayload.get('image');

        const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
        let imageUrl = '';

        if (imageFile && GOOGLE_SCRIPT_URL) {
            try {
                const arrayBuffer = await imageFile.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString('base64');

                console.log('Uploading to Google Script:', GOOGLE_SCRIPT_URL);

                const uploadResponse = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'presence',
                        fileName: presenceData.fileName,
                        mimeType: imageFile.type,
                        data: base64,
                    }),
                    redirect: 'follow',
                });

                console.log('Upload response status:', uploadResponse.status);
                const contentType = uploadResponse.headers.get('content-type');
                console.log('Upload response content-type:', contentType);

                if (contentType && contentType.includes('application/json')) {
                    const uploadResult = await uploadResponse.json();
                    console.log('Upload result:', uploadResult);

                    if (uploadResult.success) {
                        imageUrl = uploadResult.url;
                    } else {
                        console.error('Google Script error:', uploadResult.error);
                    }
                } else {
                    const responseText = await uploadResponse.text();
                    console.error('Google Script returned non-JSON response:', responseText.substring(0, 500));
                    console.warn('Continuing without image upload');
                }
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                console.warn('Continuing without image upload');
            }
        }

        const client = await clientPromise;
        const db = client.db('tasis_presence');

        let ipHeader = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || null;
        if (ipHeader && ipHeader.includes(',')) {
            ipHeader = ipHeader.split(',')[0].trim();
        }

        const presenceRecord = {
            userId: new ObjectId(decoded.id),
            username: decoded.username,
            picketType: presenceData.picketType,
            area: presenceData.area || null,
            timestamp: new Date(presenceData.timestamp),
            location: presenceData.location,
            status: presenceData.status,
            lateNotes: presenceData.lateNotes || null,
            imageUrl: imageUrl,
            deviceInfo: presenceData.deviceInfo || null,
            ip: ipHeader,
            createdAt: new Date(),
        };

        const result = await db.collection('presences').insertOne(presenceRecord);

        return NextResponse.json({
            success: true,
            presenceId: result.insertedId.toString(),
        });
    } catch (error) {
        console.error('Submit presence error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}
