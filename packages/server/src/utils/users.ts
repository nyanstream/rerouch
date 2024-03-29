import { UserRoles } from '../db/users.types.js';
import { createUser as createDbUser } from '../db/users.js';

import { UserRoleType } from '../server/routes/user-routes/types.js';

import { getPasswordHash } from './crypto.js';

export const createUser = async (user_name: string, password: string, roles: UserRoles[]) => {
    const passwordHash = await getPasswordHash(password);

    const userId = await createDbUser(
        {
            user_name,
            password_hash: passwordHash,
        },
        roles
    );

    return userId;
};

export const createUserRolesArray = (rolesId: UserRoles[]) => {
    const rolesArray = rolesId.map(roleId => {
        const userRole: UserRoleType = {
            id: roleId,
            title: UserRoles[roleId],
        };

        return userRole;
    });

    return rolesArray;
};

export const getCompleteUserRolesArray = () => {
    const keys = Object.keys(UserRoles);

    const rolesId = keys
        .filter(key => {
            return !isNaN(Number(key));
        })
        .map(roleStringId => {
            return Number(roleStringId);
        });

    return createUserRolesArray(rolesId);
};
