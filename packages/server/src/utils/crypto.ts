import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid/async';

const SALT_ROUNDS = 10;

export const getPasswordHash = async (password: string) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export const getSessionCookieValue = async (userId: string) => {
    const randomId = await nanoid();

    const salt = `${randomId}@${userId}`;

    const hash = createHash('sha256');

    const value = hash.update(salt).digest('hex');

    return value;
};
