import { ObjectId } from 'mongodb';
import type { FastifyPluginAsync, FastifySchema } from 'fastify';

import { getSchedule, getAirsCount, createAir, updateAir } from '../../db/schedule.js';
import { AirType } from '../../db/schedule.types.js';

import { getUser } from '../../db/users.js';

import type { ScheduleQueryParamsType, ScheduleQueryResponseType } from './schedule-routes.types.js';
import type { AirsCountQueryResponseType } from './schedule-routes.types.js';
import type { CreateAirQueryParamsType, CreateAirQueryResponseType } from './schedule-routes.types.js';
import type { EditAirQueryParamsType } from './schedule-routes.types.js';

const routes: FastifyPluginAsync = async (app, options) => {
    const ScheduleSchema: FastifySchema = {
        querystring: {
            type: 'object',
            properties: {
                skip: { type: 'number', minimum: 0 },
                limit: { type: 'number', minimum: 1 },
            },
        },
    };

    app.get(
        '/get-schedule',
        {
            schema: ScheduleSchema,
            preHandler: app.auth([(app as any).verifyStreamerUserSession]),
        },
        async (req, res) => {
            const RequestParams = req.query as ScheduleQueryParamsType;

            const { skip = 0, limit = 20 } = RequestParams;

            const schedule = await getSchedule({}, { skip, limit, sort: ['start_date', 'asc'] });

            const responseObject: ScheduleQueryResponseType = schedule;

            res.status(200).send(responseObject);
        }
    );

    app.get(
        '/get-airs-count',
        {
            schema: {},
            preHandler: app.auth([(app as any).verifyStreamerUserSession]),
        },
        async (req, res) => {
            const scheduleSize = await getAirsCount();

            const responseObject: AirsCountQueryResponseType = {
                count: scheduleSize,
            };

            res.status(200).send(responseObject);
        }
    );

    app.get(
        '/get-latest-schedule',
        {
            schema: {},
        },
        async (req, res) => {
            const schedule = await getSchedule({}, { limit: 20, sort: ['start_date', 'asc'] });

            res.status(200).send(schedule);
        }
    );

    const CreateAirSchema: FastifySchema = {
        body: {
            type: 'object',
            required: ['text', 'streamerId', 'startDate', 'endDate', 'hidden'],
            properties: {
                text: { type: 'string', minimum: 1 },
                streamerId: { type: 'string', minimum: 1 },
                startDate: { type: 'string', minimum: 1 },
                endDate: { type: 'string', minimum: 1 },
                hidden: { type: 'boolean' },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
            },
        },
    };

    app.post(
        '/create-air',
        {
            schema: CreateAirSchema,
            preHandler: app.auth([(app as any).verifyStreamerUserSession]),
        },
        async (req, res) => {
            const RequestBody = req.body as CreateAirQueryParamsType;

            const stramerUser = await getUser({ _id: new ObjectId(RequestBody.streamerId) });

            if (!stramerUser) {
                res.status(400).send();
                return;
            }

            const newAirInfo: AirType = {
                start_date: new Date(RequestBody.startDate),
                end_date: new Date(RequestBody.endDate),
                text: RequestBody.text,
                streamer_id: RequestBody.streamerId,
                streamer_name: stramerUser.user_name,
                hidden: RequestBody.hidden,
            };

            const airId = await createAir(newAirInfo);

            const ResponseObject: CreateAirQueryResponseType = {
                id: airId,
            };

            res.status(200).send(ResponseObject);
        }
    );

    const EditAirSchema: FastifySchema = {
        body: {
            type: 'object',
            required: ['id', 'text', 'streamerId', 'startDate', 'endDate', 'hidden'],
            properties: {
                id: { type: 'string', minimum: 1 },
                text: { type: 'string', minimum: 1 },
                streamerId: { type: 'string', minimum: 1 },
                startDate: { type: 'string', minimum: 1 },
                endDate: { type: 'string', minimum: 1 },
                hidden: { type: 'boolean' },
            },
        },
    };

    app.patch(
        '/edit-air',
        {
            schema: EditAirSchema,
            preHandler: app.auth([(app as any).verifyStreamerUserSession]),
        },
        async (req, res) => {
            const RequestBody = req.body as EditAirQueryParamsType;

            const stramerUser = await getUser({ _id: new ObjectId(RequestBody.streamerId) });

            if (!stramerUser) {
                res.status(400).send();
                return;
            }

            const newAirInfo: AirType = {
                start_date: new Date(RequestBody.startDate),
                end_date: new Date(RequestBody.endDate),
                text: RequestBody.text,
                streamer_id: RequestBody.streamerId,
                streamer_name: stramerUser.user_name,
                hidden: RequestBody.hidden,
            };

            await updateAir({ _id: new ObjectId(RequestBody.id) }, newAirInfo);

            res.status(200).send();
        }
    );
};

export default routes;
