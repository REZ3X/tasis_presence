import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        // Await params in Next.js 15+
        const { fileId } = await params;

        // Fetch image from Google Drive thumbnail API
        const imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;

        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            console.error('Google Drive fetch failed:', response.status, response.statusText);
            throw new Error('Failed to fetch image');
        }

        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400', // Cache for 1 day
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to load image' },
            { status: 500 }
        );
    }
}

