import { ObjectId } from 'mongodb';
import type { Filter } from 'mongodb';

import { getSessionCookieValue } from '../utils/crypto.js';
import { addDaysToDate } from '../utils/dates.js';

import { createMongoClient } from './common.js';

import { SessionType, NewSessionType } from './sessions.types.js';

const SESSIONS_COLLECTION = 'sessions';

export const createSession = async (userId: SessionType['user_id']) => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const currentDate = new Date();
        const tomorrowDate = addDaysToDate(currentDate, 1);

        const newCookie = getSessionCookieValue(userId, currentDate);

        const sessionData: SessionType = {
            cookie: newCookie,
            user_id: userId,
            auth_date: currentDate,
            auth_end_date: tomorrowDate,
        };

        const sessions = client.db().collection<SessionType>(SESSIONS_COLLECTION);

        const newSessionsInfo = await sessions.insertOne(sessionData);
        const newSessionsId = newSessionsInfo.insertedId.toString();

        const data: NewSessionType = {
            id: newSessionsId,
            data: sessionData,
        };

        return data;
    } finally {
        await client.close();
    }
};

export const getSession = async (filter: Filter<SessionType>) => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const sessions = client.db().collection<SessionType>(SESSIONS_COLLECTION);
        const sessionInfo = await sessions.findOne(filter);

        return sessionInfo;
    } finally {
        await client.close();
    }
};

export const getSessions = async (filter: Filter<SessionType>) => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const sessions = client.db().collection<SessionType>(SESSIONS_COLLECTION);
        const sessionsArray = await sessions.find(filter).toArray();

        return sessionsArray;
    } finally {
        await client.close();
    }
};

export const extendSession = async (filter: Filter<SessionType>) => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const currentDate = new Date();
        const tomorrowDate = addDaysToDate(currentDate, 1);

        const authEndDate = tomorrowDate.toISOString();

        const sessions = client.db().collection<SessionType>(SESSIONS_COLLECTION);

        await sessions.updateOne(filter, {
            auth_end_date: authEndDate,
        });
    } finally {
        await client.close();
    }
};

export const deleteSessions = async (filter: Filter<SessionType>) => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const sessions = client.db().collection<SessionType>(SESSIONS_COLLECTION);

        await sessions.deleteMany(filter);
    } finally {
        await client.close();
    }
};

export const clearOldSessions = async () => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const currentDate = new Date();

        const sessions = client.db().collection<SessionType>(SESSIONS_COLLECTION);
        const sessionsArray = await sessions.find().toArray();

        if (sessionsArray.length === 0) {
            return;
        }

        const sessionsToDelete = sessionsArray
            .filter(session => {
                const authEndDate = session.auth_end_date;
                return +authEndDate < +currentDate;
            })
            .map(session => new ObjectId(session._id));

        await sessions.deleteMany({ _id: { $in: sessionsToDelete } });
    } finally {
        await client.close();
    }
};
