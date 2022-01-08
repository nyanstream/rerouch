import type { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (app, options) => {
    app.get(
        '/shutdown',
        {
            schema: {},
            preHandler: app.auth([(app as any).verifyAdminUserSession]),
        },
        async (req, res) => {
            res.status(200).send();
            process.exit();
        }
    );
};

export default routes;
