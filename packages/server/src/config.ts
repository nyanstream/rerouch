import path from 'path';
import dotenv from 'dotenv';

import { createDirname } from './utils/node-utils.js';

dotenv.config();

const __dirname = createDirname(import.meta.url);

const TimeZone = '+03:00'; // Moscow/Europe

export default {
    version: 1,

    timeZone: TimeZone,

    paths: {
        static: path.join(__dirname, 'static'),

        client: path.join(__dirname, 'client'),
    },

    server: {
        host: process.env.APP_IP,

        port: Number(process.env.APP_PORT),

        db_connection_string: process.env.DB_CONNECTION_STRING,
    },

    password_salt: process.env.PASSWORD_SALT ?? '',

    API_KEYS: {
        recaptcha: process.env.API_RECAPTCHA_SERVER_KEY,
    },
};
