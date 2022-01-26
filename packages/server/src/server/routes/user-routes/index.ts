import { ObjectId } from 'mongodb';
import type { FastifyPluginAsync, FastifySchema } from 'fastify';

import { createUser, createUserRolesArray, getCompleteUserRolesArray } from '../../../utils/users.js';
import { getPasswordHash } from '../../../utils/crypto.js';

import { UserRoles } from '../../../db/users.types.js';
import { getUser, getUsers, getUsersCount, updateUser } from '../../../db/users.js';

import { getUserSessionByCookie, checkUserRoles } from '../../utils/auth.js';

import type { CreateAdminUserQueryParamsType, CreateAdminUserQueryResponseType } from './types.js';
import { CreateAdminUserParamsSchema, CreateAdminUserResponseSchema } from './schemas.js';

import type { ChangePasswordQueryParamsType } from './types.js';
import { ChangePasswordParamsSchema } from './schemas.js';

import type { RolesQueryResponseType } from './types.js';
import { RolesResponseSchema } from './schemas.js';

import type { CurrentUserInfoQueryResponseType } from './types.js';
import { CurrentUserInfoResponseSchema } from './schemas.js';

import type { StreamersQueryResponseType } from './types.js';
import { StreamersResponseSchema } from './schemas.js';

const swaggerTags: string[] = ['user'];

const streamersRoles = [UserRoles.streamer, UserRoles.admin];

const routes: FastifyPluginAsync = async app => {
    const CreateAdminUserSchema: FastifySchema = {
        tags: swaggerTags,
        body: CreateAdminUserParamsSchema,
        response: {
            200: CreateAdminUserResponseSchema,
        },
    };

    app.post<{ Body: CreateAdminUserQueryParamsType; Reply: CreateAdminUserQueryResponseType }>(
        '/create-admin-user-if-no-one-exists',
        {
            schema: CreateAdminUserSchema,
        },
        async (req, res) => {
            const requestBody = req.body;

            const usersCount = await getUsersCount();

            if (usersCount > 0) {
                res.status(401).send();
                return;
            }

            const userId = await createUser(requestBody.user_name, requestBody.password, [UserRoles.user, UserRoles.admin]);

            const ResponseObject: CreateAdminUserQueryResponseType = {
                id: userId,
            };

            res.status(200).send(ResponseObject);
        }
    );

    const CurrentUserInfoSchema: FastifySchema = {
        tags: swaggerTags,
        response: {
            200: CurrentUserInfoResponseSchema,
        },
    };

    app.get<{ Reply: CurrentUserInfoQueryResponseType }>(
        '/get-current-user-info',
        {
            schema: CurrentUserInfoSchema,
        },
        async (req, res) => {
            const session = await getUserSessionByCookie(req.cookies);

            const user = await getUser({ _id: new ObjectId(session.user_id) });

            const CurrentUserInfo: CurrentUserInfoQueryResponseType = {
                id: user._id.toString(),
                user_name: user.user_name,
                roles: createUserRolesArray(user.roles),
                registration_date: user.registration_date.toISOString(),
            };

            res.status(200).send(CurrentUserInfo);
        }
    );

    const RolesSchema: FastifySchema = {
        tags: swaggerTags,
        response: {
            200: RolesResponseSchema,
        },
    };

    app.get<{ Reply: RolesQueryResponseType }>(
        '/get-roles',
        {
            schema: RolesSchema,
        },
        async (req, res) => {
            await getUserSessionByCookie(req.cookies);

            const responseObject: RolesQueryResponseType = getCompleteUserRolesArray();
            res.status(200).send(responseObject);
        }
    );

    const StreamersSchema: FastifySchema = {
        tags: swaggerTags,
        response: {
            200: StreamersResponseSchema,
        },
    };

    app.get<{ Reply: StreamersQueryResponseType }>(
        '/get-streamers',
        {
            schema: StreamersSchema,
        },
        async (req, res) => {
            await checkUserRoles(req.cookies, streamersRoles);

            const users = await getUsers({ roles: UserRoles.streamer });

            const streamers = users.map(user => {
                const userInfo: StreamersQueryResponseType[0] = {
                    id: user._id.toString(),
                    user_name: user.user_name,
                };

                return userInfo;
            });

            res.status(200).send(streamers);
        }
    );

    const ChangePasswordSchema: FastifySchema = {
        tags: swaggerTags,
        body: ChangePasswordParamsSchema,
    };

    app.patch<{ Body: ChangePasswordQueryParamsType }>(
        '/change-password',
        {
            schema: ChangePasswordSchema,
        },
        async (req, res) => {
            const requestBody = req.body;

            const session = await getUserSessionByCookie(req.cookies);

            const user = await getUser({ _id: new ObjectId(session.user_id) });

            const newPasswordHash = await getPasswordHash(requestBody.password);

            await updateUser(
                { _id: user._id },
                {
                    $set: {
                        password_hash: newPasswordHash,
                    },
                }
            );

            res.status(200).send();
        }
    );
};

export default routes;
