import { UserType } from '../../../db/users.types.js';

export type UserRoleType = {
    id: number;
    title: string;
};

export type FormattedUserType = {
    id: string;
    user_name: UserType['user_name'];
    roles: UserRoleType[];
    registration_date: string;
};

export type StreamerUserType = {
    id: string;
    user_name: UserType['user_name'];
};

// create-admin-user-if-no-one-exists

export type CreateAdminUserQueryParamsType = Pick<FormattedUserType, 'user_name'> & {
    password: string;
};

export type CreateAdminUserQueryResponseType = Pick<FormattedUserType, 'id'>;

// get-current-user-info

export type CurrentUserInfoQueryResponseType = FormattedUserType;

// change-password

export type ChangePasswordQueryParamsType = {
    password: string;
};

// get-roles

export type RolesQueryResponseType = UserRoleType[];

// get-streamers

export type StreamersQueryResponseType = StreamerUserType[];
