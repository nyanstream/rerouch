import { ObjectId } from 'mongodb';
import type { FastifyPluginAsync, FastifySchema } from 'fastify';

import { createUser } from '../../utils/users.js';

import { UserRoles } from '../../db/users.js';
import { getUser, getUsers, getUsersCount } from '../../db/users.js';
import { getSession } from '../../db/sessions.js';

import type { LoginQueryParamsType } from './auth-routes.types.js';

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
        const RequestBody = req.query as Omit<LoginQueryParamsType, 'captcha'>;

        const usersCount = await getUsersCount();

        if (usersCount > 0) {
            res.status(401).send();
            return;
        }

        const userId = await createUser(RequestBody.username, RequestBody.password, [UserRoles.user, UserRoles.admin]);

        res.status(200).send({ id: userId });
    });

    app.get(
        '/get-current-user-info',
        {
            schema: {},
            preHandler: app.auth([(app as any).verifySession]),
        },
        async (req, res) => {
            const authCookie = req.cookies['authCookie'];

            const session = await getSession({ cookie: authCookie });

            if (!session) {
                res.status(500).send();
                return;
            }

            const user = await getUser({ _id: new ObjectId(session.user_id) });

            if (!user) {
                res.status(500).send();
                return;
            }

            res.status(200).send({
                id: user._id,
                username: user.user_name,
                roles: user.roles,
            });
        }
    );

    app.get(
        '/get-users',
        {
            schema: {},
            preHandler: app.auth([(app as any).verifyAdminUserSession]),
        },
        async (req, res) => {
            const users = await getUsers();
            res.status(200).send(users ?? []);
        }
    );
};

export default routes;
