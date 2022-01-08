import { UserRoles } from '../db/users.types.js';
import { createUser as createDbUser } from '../db/users.js';

import { getHashedPasswordData } from './crypto.js';

export const createUser = async (username: string, password: string, roles: UserRoles[]) => {
    try {
        const passwordData = getHashedPasswordData(password);

        const userId = await createDbUser(
            {
                user_name: username,
                password_hash: passwordData.hash,
                password_salt: passwordData.salt,
            },
            roles
        );

        return userId;
    } catch (err) {
        console.warn(err);
    }
};
