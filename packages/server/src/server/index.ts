import Fastify from 'fastify';
import FastifyAuthPlugin from 'fastify-auth';
import FastifyCorsPlugin from 'fastify-cors';
import FastifyHelmetPlugin from 'fastify-helmet';
import FastifyCookiePlugin from 'fastify-cookie';
import FastifyStaticPlugin from 'fastify-static';
import FastifySwaggerPlugin from 'fastify-swagger';

import CONFIG from '../config.js';

import { appRoutes, authRoutes, scheduleRoutes, userRoutes } from './routes/index.js';
import { verifySession, verifyStreamerUserSession, verifyAdminUserSession, verifyCaptcha } from './auth-decorators.js';

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

app.decorate('verifySession', verifySession);
app.decorate('verifyStreamerUserSession', verifyStreamerUserSession);
app.decorate('verifyAdminUserSession', verifyAdminUserSession);
app.decorate('verifyCaptcha', verifyCaptcha);

// Swagger

const DocsPath = '/apidocs';

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

app.register(appRoutes, { prefix: '/api/app' });

app.register(authRoutes, { prefix: '/api/auth' });

app.register(scheduleRoutes, { prefix: '/api/schedule' });

app.register(userRoutes, { prefix: '/api/user' });

app.setNotFoundHandler(async (req, res) => {
    res.status(404);
    res.sendFile('404.html');
});

export default app;
