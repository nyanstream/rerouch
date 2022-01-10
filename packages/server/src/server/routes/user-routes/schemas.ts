import type { JSONSchemaType } from 'ajv';

import type { UserRoleType } from './types.js';
import type { FormattedUserType } from './types.js';
import type { CreateAdminUserQueryParamsType, CreateAdminUserQueryResponseType } from './types.js';
import type { CurrentUserInfoQueryResponseType } from './types.js';
import type { StreamersQueryResponseType } from './types.js';
import type { RolesQueryResponseType } from './types.js';
import type { ChangePasswordQueryParamsType } from './types.js';

const RoleSchema: JSONSchemaType<UserRoleType> = {
    type: 'object',
    required: ['id', 'title'],
    properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
    },
};

const UserSchema: JSONSchemaType<FormattedUserType> = {
    type: 'object',
    required: ['id', 'user_name', 'roles', 'registration_date'],
    properties: {
        id: { type: 'string' },
        user_name: { type: 'string' },
        roles: { type: 'array', items: RoleSchema },
        registration_date: { type: 'string' },
    },
};

// create-admin-user-if-no-one-exists

export const CreateAdminUserParamsSchema: JSONSchemaType<CreateAdminUserQueryParamsType> = {
    type: 'object',
    required: ['user_name', 'password'],
    properties: {
        user_name: { type: 'string' },
        password: { type: 'string' },
    },
    additionalProperties: false,
};

export const CreateAdminUserResponseSchema: JSONSchemaType<CreateAdminUserQueryResponseType> = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'string' },
    },
};

// get-roles

export const RolesResponseSchema: JSONSchemaType<RolesQueryResponseType> = {
    type: 'array',
    items: RoleSchema,
};

// get-streamers

export const StreamersResponseSchema: JSONSchemaType<StreamersQueryResponseType> = {
    type: 'array',
    items: {
        type: 'object',
        required: ['id', 'user_name'],
        properties: {
            id: { type: 'string' },
            user_name: { type: 'string' },
        },
    },
};

// get-current-user-info

export const CurrentUserInfoResponseSchema: JSONSchemaType<CurrentUserInfoQueryResponseType> = UserSchema;

// change-password

export const ChangePasswordParamsSchema: JSONSchemaType<ChangePasswordQueryParamsType> = {
    type: 'object',
    required: ['password'],
    properties: {
        password: { type: 'string' },
    },
    additionalProperties: false,
};
