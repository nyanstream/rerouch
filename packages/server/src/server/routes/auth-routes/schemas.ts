import type { JSONSchemaType } from 'ajv';

import type { LoginQueryParamsType } from './types.js';

export const LoginParamsSchema: JSONSchemaType<LoginQueryParamsType> = {
    type: 'object',
    required: ['username', 'password', 'captcha'],
    properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        captcha: { type: 'string' },
    },
    additionalProperties: false,
};
