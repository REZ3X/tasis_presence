import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-key';

export function generateToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            username: user.username,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '365d' } 
    );
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}
