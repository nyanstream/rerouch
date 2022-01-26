import type { FastifyPluginAsync, FastifySchema } from 'fastify';

import { parseMarkdown } from '../../../utils/markdown.js';

import { UserRoles } from '../../../db/users.types.js';

import { getUserSessionByCookie, checkUserRoles } from '../../utils/auth.js';

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
        },
        async (req, res) => {
            await checkUserRoles(req.cookies, [UserRoles.admin]);

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
        },
        async (req, res) => {
            await getUserSessionByCookie(req.cookies);

            const requestBody = req.body as ParseMarkdownQueryParamsType;

            const responseObject: ParseMarkdownQueryResponseType = {
                output: parseMarkdown(requestBody.input),
            };

            res.status(200).send(responseObject);
        }
    );
};

export default routes;
