import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const getPasswordHash = async (password: string) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export const getSessionCookieValue = (userId: string, authDate: Date) => {
    const hash = createHash('sha256');

    const authDateString = authDate.toISOString();

    const salt = `${userId}@${authDateString}`;

    const value = hash.update(salt).digest('hex');

    return value;
};
