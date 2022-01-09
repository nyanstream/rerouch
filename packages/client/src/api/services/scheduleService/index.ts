import { API } from '../..';

import type { ScheduleQueryParamsType, ScheduleQueryResponseType } from './types';
import type { AirsCountQueryResponseType } from './types';
import type { CreateAirQueryParamsType, CreateAirQueryResponseType } from './types';
import type { EditAirQueryParamsType } from './types';

const Controller = 'schedule';

export const ScheduleAPI = {
    getSchedule: async (params?: ScheduleQueryParamsType): Promise<ScheduleQueryResponseType> => {
        return await API.get(`${Controller}/get-schedule`, { searchParams: params }).json();
    },

    getAirsCount: async (): Promise<AirsCountQueryResponseType> => {
        return await API.get(`${Controller}/get-airs-count`).json();
    },

    createAir: async (params: CreateAirQueryParamsType): Promise<CreateAirQueryResponseType> => {
        return await API.post(`${Controller}/create-air`, { json: params }).json();
    },

    editAir: async (params: EditAirQueryParamsType): Promise<Response> => {
        return await API.patch(`${Controller}/edit-air`, { json: params });
    },
};

export default ScheduleAPI;
