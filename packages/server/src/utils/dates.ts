export const addDaysToDate = (date: Date, daysCount: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + daysCount);
    return newDate;
};
