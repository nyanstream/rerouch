import type { Filter, UpdateFilter } from 'mongodb';

import { createMongoClient } from './common.js';

import { UserType, UserRoles } from './users.types.js';

const USERS_COLLECTION = 'users';

export const createUser = async (userDocument: Omit<UserType, 'roles' | 'registration_date'>, roles: UserRoles[] = [UserRoles.guest]) => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const currentDate = new Date();

        const userDocumentWithGuestRole: UserType = {
            ...userDocument,
            roles,
            registration_date: currentDate,
        };

        const users = client.db().collection<UserType>(USERS_COLLECTION);

        const newUserInfo = await users.insertOne(userDocumentWithGuestRole);
        const newUserId = newUserInfo.insertedId.toString();

        return newUserId;
    } finally {
        await client.close();
    }
};

export const getUser = async (filter: Filter<UserType>) => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const users = client.db().collection<UserType>(USERS_COLLECTION);
        const userInfo = await users.findOne(filter);

        if (!userInfo) {
            throw new Error('User not found');
        }

        return userInfo;
    } finally {
        await client.close();
    }
};

export const getUsers = async (filter: Filter<UserType> = {}) => {
    const client = await createMongoClient();

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
    const client = await createMongoClient();

    try {
        await client.connect();

        const users = client.db().collection<UserType>(USERS_COLLECTION);
        const usersCount = await users.find(filter).count();

        return usersCount;
    } finally {
        await client.close();
    }
};

export const updateUser = async (filter: Filter<UserType>, updateDoc: UpdateFilter<UserType>) => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const users = client.db().collection<UserType>(USERS_COLLECTION);

        await users.updateOne(filter, updateDoc);
    } finally {
        await client.close();
    }
};
