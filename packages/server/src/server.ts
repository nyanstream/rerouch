import Fastify from 'fastify';
import FastifyAuthPlugin from 'fastify-auth';
import FastifyCorsPlugin from 'fastify-cors';
import FastifyHelmetPlugin from 'fastify-helmet';
import FastifyCookiePlugin from 'fastify-cookie';
import FastifyStaticPlugin from 'fastify-static';
import FastifySwaggerPlugin from 'fastify-swagger';

import CONFIG from './config.js';

const app = Fastify();

app.register(FastifyAuthPlugin);
app.register(FastifyCorsPlugin);

app.register(FastifyHelmetPlugin, {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: [`'self'`],
            // frameAncestors: [`'self' ${CONFIG.contest.site}`],
            childSrc: [`'self' https://www.google.com`],
            styleSrc: [`'self' 'unsafe-inline'`],
            scriptSrc: [`'self' 'unsafe-inline' data: https://www.google.com https://www.gstatic.com`],
        },
    },
});

app.register(FastifyCookiePlugin);

// Swagger

const DocsPath = '/apidocs';

app.addHook('onRequest', (req, res, next) => {
    // if (req.routerPath.startsWith(DocsPath) && !getIsAuth(req.cookies)) {
    //     res.status(401).send();
    //     return;
    // }

    next();
});

app.register(FastifySwaggerPlugin, {
    routePrefix: DocsPath,
    openapi: {
        info: {
            title: 'NYAN.STREAM API',
            version: String(CONFIG.version),
        },
    },
    staticCSP: true,
    exposeRoute: true,
});

app.register(FastifyStaticPlugin, { root: CONFIG.paths.static });

// app.register(FastifyStaticPlugin, {
//     root: ClientPath,
//     prefix: '/client/',
//     decorateReply: false,
// });

app.get('/robots.txt', { schema: { hide: true } }, async (req, res) => {
    res.sendFile('robots.txt');
});

// Routes

// app.register(authRoutes, { prefix: '/api/auth' });

// app.register(sendFormRoutes, { prefix: '/api/send-form' });

// app.register(gamesRoutes, { prefix: '/api/games' });

// app.register(twitchLiveStreamsRoutes, { prefix: '/api/twitch' });

app.setNotFoundHandler(async (req, res) => {
    res.status(404);
    res.sendFile('404.html');
});

export default app;
