import CONFIG from './config.js';

import server from './server/index.js';
import { createMongoClient } from './db/common.js';

try {
    console.log('Checking for required server config variables...');

    if (!CONFIG.server.port) throw new Error('Port not found');
    if (!CONFIG.server.host) throw new Error('Host not found');

    console.log('Checking succeeded.');
} catch (err) {
    console.warn(err);
    process.exit(1);
}

try {
    console.log('Checking connection to the database...');

    const mongoClient = await createMongoClient();

    await mongoClient.connect();
    await mongoClient.db('admin').command({ ping: 1 });

    console.log('Checking succeeded.');

    await mongoClient.close();
} catch (err) {
    console.warn(err);
    process.exit(1);
}

server.listen(CONFIG.server.port, CONFIG.server.host, (err, address) => {
    console.log('Server started on address:', address);

    if (err) {
        server.log.error(err);
        process.exit(1);
    }
});
