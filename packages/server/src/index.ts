import CONFIG from './config.js';

import server from './server.js';

try {
    console.log('Checking for required config variables...');

    if (!CONFIG.server.port) throw new Error('Port not found');
    if (!CONFIG.server.host) throw new Error('Host not found');
    if (!CONFIG.server.db_connection_string) throw new Error('MongoDB connection string not found');

    console.log('Checking succeeded.');
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
