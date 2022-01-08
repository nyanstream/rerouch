import { MongoClient } from 'mongodb';

import CONFIG from '../config.js';

export const createMongoClient = async () => {
    if (!CONFIG.server.db_connection_string) throw new Error('MongoDB connection string not found');

    return new MongoClient(CONFIG.server.db_connection_string);
};
