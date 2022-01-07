import { FastifyRequest } from 'fastify';

import { getSession } from '../db/sessions.js';

export const getIsAuth = async (cookies: FastifyRequest['cookies']) => {
    const authCookie = cookies['authCookie'];

    const currentDate = new Date();

    if (!authCookie) {
        return false;
    }

    const sessionInfo = await getSession({ cookie: authCookie });

    if (!sessionInfo) {
        return false;
    }

    const authEndDate = new Date(sessionInfo.auth_end_date);

    if (+authEndDate < +currentDate) {
        return false;
    }

    return true;
};
