import type { Filter } from 'mongodb';

import { createMongoClient, ObjectId } from './common.js';

const USERS_COLLECTION = 'users';

const client = await createMongoClient();

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
};

export const createUser = async (userDocument: Omit<UserType, 'roles'>, roles: UserRoles[] = [UserRoles.guest]) => {
    try {
        await client.connect();

        const userDocumentWithGuestRole: UserType = {
            ...userDocument,
            roles,
        };

        const users = client.db().collection<UserType>(USERS_COLLECTION);

        const newUserInfo = await users.insertOne(userDocumentWithGuestRole);
        const newUserId = newUserInfo.insertedId.toString();

        return newUserId;
    } finally {
        await client.close();
    }
};

export const getUsers = async (filter: Filter<UserType> = {}) => {
    try {
        await client.connect();

        const users = client.db().collection<UserType>(USERS_COLLECTION);
        const usersArray = await users.find(filter).toArray();

        return usersArray;
    } finally {
        await client.close();
    }
};

export const getUsersCount = async (filter: Filter<UserType> = {}) => {
    try {
        await client.connect();

        const users = client.db().collection<UserType>(USERS_COLLECTION);
        const usersCount = await users.find(filter).count();

        return usersCount;
    } finally {
        await client.close();
    }
};

export const getUser = async (filter: Filter<UserType>) => {
    try {
        await client.connect();

        const users = client.db().collection<UserType>(USERS_COLLECTION);
        const userInfo = await users.findOne(filter);

        return userInfo;
    } finally {
        await client.close();
    }
};
