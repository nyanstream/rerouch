import type { JSONSchemaType } from 'ajv';

import type { ParseMarkdownQueryParamsType, ParseMarkdownQueryResponseType } from './types.js';

export const ParseMarkdownParamsSchema: JSONSchemaType<ParseMarkdownQueryParamsType> = {
    type: 'object',
    required: ['input'],
    properties: {
        input: { type: 'string' },
    },
    additionalProperties: false,
};

export const ParseMarkdownResponseSchema: JSONSchemaType<ParseMarkdownQueryResponseType> = {
    type: 'object',
    required: ['output'],
    properties: {
        output: { type: 'string' },
    },
};
