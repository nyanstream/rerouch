export type FormattedAirType = {
    id: string;
    text_html: string;
    text: string;
    link: string | null;
    streamer_id: string | null;
    streamer_name: string | null;
    start_date: string;
    end_date: string;
    hidden: boolean;
};

export type ScheduleQueryParamsType = {
    skip?: number;
    limit?: number;
};

export type ScheduleQueryResponseType = FormattedAirType[];

export type AirsCountQueryResponseType = {
    count: number;
};

export type CreateAirQueryParamsType = Omit<FormattedAirType, 'id' | 'text_html' | 'streamer_name'> & {
    dates_timezone: string;
};

export type CreateAirQueryResponseType = {
    id: string;
};

export type EditAirQueryParamsType = CreateAirQueryParamsType & Pick<FormattedAirType, 'id'>;
