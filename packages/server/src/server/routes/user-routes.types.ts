import { UserWithIdType } from '../../db/users.types.js';

export type UserRoleType = {
    id: number;
    title: string;
};

export type CurrentUserInfoQueryResponseType = {
    id: UserWithIdType['_id'];
    username: UserWithIdType['user_name'];
    roles: UserRoleType[];
    registrationDate: string;
};

export type ChangePasswordQueryParamsType = {
    password: string;
};

export type RolesQueryResponseType = UserRoleType[];

export type StreamerUserType = {
    id: string;
    username: UserWithIdType['user_name'];
};

export type StreamersQueryResponseType = StreamerUserType[];
