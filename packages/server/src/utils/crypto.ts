import { createHmac, createHash } from 'crypto';
import { nanoid } from 'nanoid';

import CONFIG from '../config.js';

type HashedPasswordData = {
    hash: string;
    salt: string;
};

export const getHashedPasswordData = (password: string, existingSalt?: string) => {
    const salt = existingSalt ?? nanoid();

    const combinedSalt = `${CONFIG.password_salt}@${salt}`;

    const hmac = createHmac('sha256', combinedSalt);

    const hash = hmac.update(password).digest('hex');

    const data: HashedPasswordData = {
        hash,
        salt,
    };

    return data;
};

export const getSessionCookieValue = (userId: string, auth_date: string) => {
    const hash = createHash('sha256');

    const salt = `${userId}@${auth_date}`;

    const value = hash.update(salt).digest('hex');

    return value;
};
