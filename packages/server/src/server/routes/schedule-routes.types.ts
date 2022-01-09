import { WithId } from 'mongodb';

import { AirType } from '../../db/schedule.types.js';

export type ScheduleQueryParamsType = {
    skip: number;
    limit?: number;
};

export type ScheduleQueryResponseType = {
    data: WithId<AirType>[];
    totalCount: number;
};

export type CreateAirQueryParamsType = {
    text: string;
    streamerId: string;
    startDate: string;
    endDate: string;
    hidden: boolean;
};

export type CreateAirQueryResponseType = {
    id: string;
};

export type EditAirQueryParamsType = CreateAirQueryParamsType & {
    id: string;
};
