import type { JSONSchemaType } from 'ajv';

import type { FormattedAirType } from './types.js';
import type { ScheduleQueryParamsType, ScheduleQueryResponseType } from './types.js';
import type { AirsCountQueryResponseType } from './types.js';
import type { CreateAirQueryParamsType, CreateAirQueryResponseType } from './types.js';
import type { EditAirQueryParamsType } from './types.js';

const FormattedAirSchema: JSONSchemaType<FormattedAirType> = {
    type: 'object',
    required: ['id', 'text', 'text_html', 'start_date', 'end_date', 'hidden'],
    properties: {
        id: { type: 'string' },
        text: { type: 'string' },
        text_html: { type: 'string' },
        link: { type: 'string', nullable: true },
        streamer_id: { type: 'string', nullable: true },
        streamer_name: { type: 'string', nullable: true },
        start_date: { type: 'string' },
        end_date: { type: 'string' },
        hidden: { type: 'boolean' },
    },
};

// get-schedule

export const ScheduleParamsSchema: JSONSchemaType<ScheduleQueryParamsType> = {
    type: 'object',
    properties: {
        skip: { type: 'integer', minimum: 0, nullable: true },
        limit: { type: 'integer', minimum: 1, nullable: true },
    },
    additionalProperties: false,
};

export const ScheduleResponseSchema: JSONSchemaType<ScheduleQueryResponseType> = {
    type: 'array',
    items: FormattedAirSchema,
};

// get-airs-count

export const AirsCountResponseSchema: JSONSchemaType<AirsCountQueryResponseType> = {
    type: 'object',
    required: ['count'],
    properties: {
        count: { type: 'integer' },
    },
};

// get-latest-schedule

// TODO

// create-air

export const CreateAirParamsSchema: JSONSchemaType<CreateAirQueryParamsType> = {
    type: 'object',
    required: ['text', 'start_date', 'end_date', 'dates_timezone', 'hidden'],
    properties: {
        text: { type: 'string' },
        link: { type: 'string', nullable: true },
        streamer_id: { type: 'string', nullable: true },
        start_date: { type: 'string' },
        end_date: { type: 'string' },
        dates_timezone: { type: 'string' },
        hidden: { type: 'boolean' },
    },
    additionalProperties: false,
};

export const CreateAirResponseSchema: JSONSchemaType<CreateAirQueryResponseType> = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'string' },
    },
};

// /edit-air

export const EditAirQueryParamsSchema: JSONSchemaType<EditAirQueryParamsType> = {
    type: 'object',
    required: ['id', 'text', 'start_date', 'end_date', 'dates_timezone', 'hidden'],
    properties: {
        id: { type: 'string' },
        text: { type: 'string' },
        link: { type: 'string', nullable: true },
        streamer_id: { type: 'string', nullable: true },
        start_date: { type: 'string' },
        end_date: { type: 'string' },
        dates_timezone: { type: 'string' },
        hidden: { type: 'boolean' },
    },
    additionalProperties: false,
};
