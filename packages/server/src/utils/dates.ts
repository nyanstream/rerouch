import dayjs from 'dayjs';

import dayjsUtcPlugin from 'dayjs/plugin/utc.js';
import dayjsTimezonePlugin from 'dayjs/plugin/timezone.js';

dayjs.extend(dayjsUtcPlugin);
dayjs.extend(dayjsTimezonePlugin);

export const addDaysToDate = (date: Date, daysCount: number) => {
    const newDate = dayjs(date).add(daysCount, 'day');
    return newDate.toDate();
};

export const getStandardDateFromDateWithTimezone = (dateString: string, timezone: string) => {
    const date = dayjs(dateString).tz(timezone);
    return date.toDate();
};
