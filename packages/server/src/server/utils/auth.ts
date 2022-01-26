import { ObjectId } from 'mongodb';
import type { FastifyRequest } from 'fastify';

import { getUser } from '../../db/users.js';
import { UserRoles } from '../../db/users.types.js';

import { getSession } from '../../db/sessions.js';

export const getUserSessionByCookie = async (cookies: FastifyRequest['cookies']) => {
    const authCookie = cookies['authCookie'];

    if (!authCookie) {
        throw new Error('Cookie not found');
    }

    const sessionInfo = await getSession({ cookie: authCookie });

    const currentDate = new Date();
    const authEndDate = new Date(sessionInfo.auth_end_date);

    if (+authEndDate < +currentDate) {
        throw new Error('Session is out of date');
    }

    return sessionInfo;
};

export const checkUserRoles = async (cookies: FastifyRequest['cookies'], requiredRoles: UserRoles[]) => {
    const sessionInfo = await getUserSessionByCookie(cookies);

    const user = await getUser({ _id: new ObjectId(sessionInfo.user_id) });

    const filtredRoles = requiredRoles.filter(role => {
        return user.roles.includes(role);
    });

    if (filtredRoles.length === 0) {
        throw new Error('User does not have the required roles');
    }
};
