import type { FastifyPluginAsync, FastifySchema } from 'fastify';

import { getHashedPasswordData } from '../../utils/crypto.js';
import { getIsAuth } from '../../utils/check-auth.js';

import { UserRoles } from '../../db/users.js';

import { createUser as createDbUser } from '../../db/users.js';
import { getUser, getUsers, getUsersCount } from '../../db/users.js';

import { createSession } from '../../db/sessions.js';

const createUser = async (username: string, password: string, roles: UserRoles[]) => {
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

const routes: FastifyPluginAsync = async (app, options) => {
    const CreateAdminUserSchema: FastifySchema = {
        querystring: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
            },
        },
        response: {
            200: {
                id: { type: 'string' },
            },
        },
    };

    app.post('/create-admin-user-if-no-one-exists', { schema: CreateAdminUserSchema }, async (req, res) => {
        const RequestBody = req.query as { username: string; password: string };

        const usersCount = await getUsersCount();

        if (usersCount > 0) {
            res.status(401).send();
            return;
        }

        const userId = await createUser(RequestBody.username, RequestBody.password, [UserRoles.user, UserRoles.admin]);

        res.status(200).send({ id: userId });
    });

    const LoginSchema: FastifySchema = {
        body: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
            },
        },
    };

    app.post('/login', { schema: LoginSchema }, async (req, res) => {
        const RequestBody = req.body as { username: string; password: string };

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

    app.head('/check', { schema: {} }, async (req, res) => {
        const isAuth = await getIsAuth(req.cookies);
        const responseStatus = isAuth ? 200 : 401;

        res.status(responseStatus).send();
    });

    app.get('/get-users', { schema: {} }, async (req, res) => {
        const isAuth = await getIsAuth(req.cookies);

        if (isAuth) {
            const users = await getUsers();
            res.status(200).send(users);
        }

        res.status(401).send([]);
    });
};

export default routes;
