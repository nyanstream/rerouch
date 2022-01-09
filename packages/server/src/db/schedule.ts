import { ObjectId } from 'mongodb';
import type { Filter, UpdateFilter, FindOptions } from 'mongodb';

import { createMongoClient } from './common.js';

import { AirType } from './schedule.types.js';

const SCHEDULE_COLLECTION = 'schedule';

export const createAir = async (airInfo: AirType) => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const schedule = client.db().collection<AirType>(SCHEDULE_COLLECTION);

        const newAirInfo = await schedule.insertOne(airInfo);
        const newAirId = newAirInfo.insertedId.toString();

        return newAirId;
    } finally {
        await client.close();
    }
};

export const getSchedule = async (filter: Filter<AirType>, options?: FindOptions<AirType>) => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const schedule = client.db().collection<AirType>(SCHEDULE_COLLECTION);

        const airs = schedule.find(filter, options);
        const airsArray = await airs.toArray();

        return airsArray;
    } finally {
        await client.close();
    }
};

export const updateAir = async (filter: Filter<AirType>, updateDoc: UpdateFilter<AirType>) => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const schedule = client.db().collection<AirType>(SCHEDULE_COLLECTION);

        await schedule.updateOne(filter, updateDoc);
    } finally {
        await client.close();
    }
};

export const deleteAirs = async (airsId: string[]) => {
    const client = await createMongoClient();

    try {
        await client.connect();

        const schedule = client.db().collection<AirType>(SCHEDULE_COLLECTION);

        const airsObjestId = airsId.map(airId => {
            return new ObjectId(airId);
        });

        await schedule.deleteMany({ _id: airsObjestId });
    } finally {
        await client.close();
    }
};
