import type { FastifyPluginAsync, FastifySchema } from 'fastify';

import { getHashedPasswordData } from '../../../utils/crypto.js';

import { getUser } from '../../../db/users.js';
import { createSession, deleteSessions } from '../../../db/sessions.js';

import type { LoginQueryParamsType } from './types.js';
import { LoginParamsSchema } from './schemas.js';

const swaggerTags: string[] = ['auth'];

const routes: FastifyPluginAsync = async app => {
    const LoginSchema: FastifySchema = {
        tags: swaggerTags,
        body: LoginParamsSchema,
    };

    app.post('/login', { schema: LoginSchema }, async (req, res) => {
        const RequestBody = req.body as LoginQueryParamsType;

        const userInfo = await getUser({ user_name: RequestBody.username });

        // if user not found
        if (!userInfo) {
            res.status(404).send();
            return;
        }

        const passwordData = getHashedPasswordData(RequestBody.password, userInfo.password_salt);

        if (passwordData.hash !== userInfo.password_hash) {
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
            preHandler: app.auth([(app as any).verifySession]),
        },
        async (req, res) => {
            const authCookie = req.cookies['authCookie'];

            await deleteSessions({ cookie: authCookie });

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
            preHandler: app.auth([(app as any).verifySession]),
        },
        async (req, res) => {
            res.status(200).send();
        }
    );
};

export default routes;
