import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { generateToken } from '@/lib/auth';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: 'Username dan password wajib diisi' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('tasis_presence');

        const user = await db.collection('users').findOne({ username });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Username atau password salah' },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Username atau password salah' },
                { status: 401 }
            );
        }

        const token = generateToken(user);

        return NextResponse.json({
            success: true,
            token,
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
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}
