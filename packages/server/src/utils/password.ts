import { createHmac } from 'crypto';
import { nanoid } from 'nanoid';

import CONFIG from '../config.js';

type HashedPasswordData = {
    hash: string;
    salt: string;
};

export const getHashedPasswordData = (password: string, existingSalt?: string) => {
    const salt = existingSalt ?? nanoid();

    const hmac = createHmac('sha256', salt + CONFIG.password_salt);

    const hash = hmac.update(password).digest('hex');

    const data: HashedPasswordData = {
        hash,
        salt,
    };

    return data;
};
