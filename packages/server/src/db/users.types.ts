import type { WithId } from 'mongodb';

export enum UserRoles {
    guest = 0,
    user,
    moderator,
    streamer,
    admin,
}

export type UserType = {
    user_name: string;
    roles: UserRoles[];
    password_hash: string;
    password_salt: string;
    registration_date: Date;
};

export type UserWithIdType = WithId<UserType>;
