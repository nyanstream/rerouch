import { ObjectId } from 'mongodb';
import type { FastifyPluginAsync, FastifySchema } from 'fastify';

import { createUser, createUserRolesArray, getCompleteUserRolesArray } from '../../utils/users.js';
import { getHashedPasswordData } from '../../utils/crypto.js';

import { UserRoles } from '../../db/users.types.js';
import { getUser, getUsers, getUsersCount, updateUser } from '../../db/users.js';
import { getSession } from '../../db/sessions.js';

import type { LoginQueryParamsType } from './auth-routes.types.js';
import type { CurrentUserInfoQueryResponseType, ChangePasswordQueryParamsType } from './user-routes.types.js';

const routes: FastifyPluginAsync = async (app, options) => {
    const CreateAdminUserSchema: FastifySchema = {
        querystring: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
                username: { type: 'string', minimum: 1 },
                password: { type: 'string', minimum: 1 },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
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

            const CurrentUserInfo: CurrentUserInfoQueryResponseType = {
                id: user._id,
                username: user.user_name,
                roles: createUserRolesArray(user.roles),
                registrationDate: user.registration_date.toISOString(),
            };

            res.status(200).send(CurrentUserInfo);
        }
    );

    app.get(
        '/get-roles',
        {
            schema: {},
            preHandler: app.auth([(app as any).verifySession]),
        },
        async (req, res) => {
            const rolesArray = getCompleteUserRolesArray();
            res.status(200).send(rolesArray);
        }
    );

    app.get(
        '/get-streamers',
        {
            schema: {},
            preHandler: app.auth([(app as any).verifyStreamerUserSession]),
        },
        async (req, res) => {
            const users = await getUsers({ roles: UserRoles.streamer });
            res.status(200).send(users ?? []);
        }
    );

    const ChangePasswordSchema: FastifySchema = {
        body: {
            type: 'object',
            required: ['password'],
            properties: {
                password: { type: 'string', minimum: 1 },
            },
        },
    };

    app.patch(
        '/change-password',
        {
            schema: ChangePasswordSchema,
            preHandler: app.auth([(app as any).verifySession]),
        },
        async (req, res) => {
            const RequestBody = req.body as ChangePasswordQueryParamsType;

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

            const newPasswordData = getHashedPasswordData(RequestBody.password);

            await updateUser(
                { _id: user._id },
                {
                    $set: {
                        password_salt: newPasswordData.salt,
                        password_hash: newPasswordData.hash,
                    },
                }
            );

            res.status(200).send();
        }
    );
};

export default routes;
