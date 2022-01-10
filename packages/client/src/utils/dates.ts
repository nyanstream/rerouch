import dayjs, { ConfigType as DayjsInputType } from 'dayjs';

export const formatDateToDateTimeInput = (date: DayjsInputType) => {
    return dayjs(date).format('YYYY-MM-DDTHH:mm');
};
