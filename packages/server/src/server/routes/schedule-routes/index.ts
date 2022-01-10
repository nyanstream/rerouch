import { ObjectId } from 'mongodb';
import type { FastifyPluginAsync, FastifySchema } from 'fastify';

import { parseMarkdown } from '../../../utils/markdown.js';
import { getStandardDateFromDateWithTimezone } from '../../../utils/dates.js';

import { getSchedule, getAirsCount, createAir, updateAir } from '../../../db/schedule.js';
import { AirType } from '../../../db/schedule.types.js';

import { getUser } from '../../../db/users.js';

import type { ScheduleQueryParamsType, ScheduleQueryResponseType } from './types.js';
import { ScheduleParamsSchema, ScheduleResponseSchema } from './schemas.js';

import type { AirsCountQueryResponseType } from './types.js';
import { AirsCountResponseSchema } from './schemas.js';

import type { CreateAirQueryParamsType, CreateAirQueryResponseType } from './types.js';
import { CreateAirParamsSchema, CreateAirResponseSchema } from './schemas.js';

import type { EditAirQueryParamsType } from './types.js';
import { EditAirQueryParamsSchema } from './schemas.js';

const swaggerTags: string[] = ['schedule'];

const routes: FastifyPluginAsync = async app => {
    const ScheduleSchema: FastifySchema = {
        tags: swaggerTags,
        querystring: ScheduleParamsSchema,
        response: {
            200: ScheduleResponseSchema,
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

            const responseObject = schedule.map(airInfo => {
                const formattedAirInfo: ScheduleQueryResponseType[0] = {
                    id: airInfo._id.toString(),
                    text: parseMarkdown(airInfo.text),
                    link: airInfo.link,
                    streamer_id: airInfo.streamer_id,
                    streamer_name: airInfo.streamer_name,
                    start_date: airInfo.start_date.toISOString(),
                    end_date: airInfo.end_date.toISOString(),
                    hidden: airInfo.hidden,
                };

                return formattedAirInfo;
            });

            res.status(200).send(responseObject);
        }
    );

    const AirsCountSchema: FastifySchema = {
        tags: swaggerTags,
        response: {
            200: AirsCountResponseSchema,
        },
    };

    app.get(
        '/get-airs-count',
        {
            schema: AirsCountSchema,
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

    // app.get(
    //     '/get-latest-schedule',
    //     {
    //         schema: {},
    //     },
    //     async (req, res) => {
    //         const schedule = await getSchedule({}, { limit: 20, sort: ['start_date', 'asc'] });

    //         res.status(200).send(schedule);
    //     }
    // );

    const CreateAirSchema: FastifySchema = {
        tags: swaggerTags,
        body: CreateAirParamsSchema,
        response: {
            200: CreateAirResponseSchema,
        },
    };

    app.post(
        '/create-air',
        {
            schema: CreateAirSchema,
            preHandler: app.auth([(app as any).verifyStreamerUserSession]),
        },
        async (req, res) => {
            const requestBody = req.body as CreateAirQueryParamsType;

            const streamerUserId = requestBody.streamer_id;
            let streamerUserName: string | null = null;

            if (streamerUserId) {
                const stramerUser = await getUser({ _id: new ObjectId(streamerUserId) });

                if (stramerUser) {
                    streamerUserName = stramerUser.user_name;
                }
            }

            const datesTimezone = requestBody.dates_timezone;

            const newAirInfo: AirType = {
                start_date: getStandardDateFromDateWithTimezone(requestBody.start_date, datesTimezone),
                end_date: getStandardDateFromDateWithTimezone(requestBody.end_date, datesTimezone),
                text: requestBody.text,
                link: requestBody.link,
                streamer_id: streamerUserId,
                streamer_name: streamerUserName,
                hidden: requestBody.hidden,
            };

            const airId = await createAir(newAirInfo);

            const ResponseObject: CreateAirQueryResponseType = {
                id: airId,
            };

            res.status(200).send(ResponseObject);
        }
    );

    const EditAirSchema: FastifySchema = {
        tags: swaggerTags,
        body: EditAirQueryParamsSchema,
    };

    app.patch(
        '/edit-air',
        {
            schema: EditAirSchema,
            preHandler: app.auth([(app as any).verifyStreamerUserSession]),
        },
        async (req, res) => {
            const requestBody = req.body as EditAirQueryParamsType;

            const streamerUserId = requestBody.streamer_id;
            let streamerUserName: string | null = null;

            if (streamerUserId) {
                const stramerUser = await getUser({ _id: new ObjectId(streamerUserId) });

                if (stramerUser) {
                    streamerUserName = stramerUser.user_name;
                }
            }

            const newAirInfo: AirType = {
                start_date: new Date(requestBody.start_date),
                end_date: new Date(requestBody.end_date),
                text: requestBody.text,
                link: requestBody.link,
                streamer_id: streamerUserId,
                streamer_name: streamerUserName,
                hidden: requestBody.hidden,
            };

            await updateAir({ _id: new ObjectId(requestBody.id) }, newAirInfo);

            res.status(200).send();
        }
    );
};

export default routes;
