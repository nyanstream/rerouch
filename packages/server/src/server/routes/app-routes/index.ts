import type { FastifyPluginAsync, FastifySchema } from 'fastify';

import { parseMarkdown } from '../../../utils/markdown.js';

import type { ParseMarkdownQueryParamsType, ParseMarkdownQueryResponseType } from './types';
import { ParseMarkdownParamsSchema, ParseMarkdownResponseSchema } from './schemas.js';

const swaggerTags: string[] = ['app'];

const routes: FastifyPluginAsync = async app => {
    const ShutdownSchema: FastifySchema = {
        tags: swaggerTags,
    };

    app.get(
        '/shutdown',
        {
            schema: ShutdownSchema,
            preHandler: app.auth([(app as any).verifyAdminUserSession]),
        },
        async (req, res) => {
            res.status(200).send();
            process.exit();
        }
    );

    const ParseMarkdownSchema: FastifySchema = {
        tags: swaggerTags,
        body: ParseMarkdownParamsSchema,
        response: {
            200: ParseMarkdownResponseSchema,
        },
    };

    app.post(
        '/parse-markdown',
        {
            schema: ParseMarkdownSchema,
            preHandler: app.auth([(app as any).verifySession]),
        },
        async (req, res) => {
            const requestBody = req.body as ParseMarkdownQueryParamsType;

            const responseObject: ParseMarkdownQueryResponseType = {
                output: parseMarkdown(requestBody.input),
            };

            res.status(200).send(responseObject);
        }
    );
};

export default routes;
