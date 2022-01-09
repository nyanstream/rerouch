import type { ScheduleQueryResponseType, AirsCountQueryResponseType } from '../../api/services/scheduleService/types';
import type { StreamersQueryResponseType } from '../../api/services/userService/types';

type CreateAirQueryResultType = {
    timestamp: string;
    success: boolean;
};

export type AdminPanelScheduleStateType = {
    StreamersData: StreamersQueryResponseType | null;
    IsStreamersDataPending: boolean;
    ScheduleData: ScheduleQueryResponseType | null;
    IsScheduleDataPending: boolean;
    ScheduleAirsCount: AirsCountQueryResponseType['count'] | null;
    IsScheduleAirsCountPending: boolean;
    CreateAirQueryResult: CreateAirQueryResultType | null;
    IsCreateAirQueryPending: boolean;
};
