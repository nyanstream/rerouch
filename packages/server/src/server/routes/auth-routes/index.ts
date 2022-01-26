import type { FastifyPluginAsync, FastifySchema } from 'fastify';

import { verifyPassword } from '../../../utils/crypto.js';

import { getUser } from '../../../db/users.js';
import { createSession, deleteSessions } from '../../../db/sessions.js';

import { getUserSessionByCookie } from '../../utils/auth.js';

import type { LoginQueryParamsType } from './types.js';
import { LoginParamsSchema } from './schemas.js';

const swaggerTags: string[] = ['auth'];

const routes: FastifyPluginAsync = async app => {
    const LoginSchema: FastifySchema = {
        tags: swaggerTags,
        body: LoginParamsSchema,
    };

    app.post<{ Body: LoginQueryParamsType }>('/login', { schema: LoginSchema }, async (req, res) => {
        const RequestBody = req.body;

        const userInfo = await getUser({ user_name: RequestBody.username });

        const isPasswordValid = await verifyPassword(RequestBody.password, userInfo.password_hash);

        if (!isPasswordValid) {
            res.status(401).send();
            return;
        }

        const sessionData = await createSession(userInfo._id.toString());

        res.cookie('authCookie', sessionData.data.cookie, {
            expires: new Date(sessionData.data.auth_end_date),
            httpOnly: true,
            path: '/',
            sameSite: true,
            secure: true,
        });

        res.status(200).send();
    });

    const LogoutSchema: FastifySchema = {
        tags: swaggerTags,
    };

    app.post(
        '/logout',
        {
            schema: LogoutSchema,
        },
        async (req, res) => {
            const session = await getUserSessionByCookie(req.cookies);

            await deleteSessions({ _id: session._id });

            res.clearCookie('authCookie');

            res.status(200).send();
        }
    );

    const AuthCheckSchema: FastifySchema = {
        tags: swaggerTags,
    };

    app.head(
        '/check',
        {
            schema: AuthCheckSchema,
        },
        async (req, res) => {
            await getUserSessionByCookie(req.cookies);
            res.status(200).send();
        }
    );
};

export default routes;
