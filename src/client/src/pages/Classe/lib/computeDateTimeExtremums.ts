const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_REGEX = /^(\d{2}):(\d{2})$/;

function computeDateTime(date: string, time: string): Date | undefined {
    const dateMatch = date.match(DATE_REGEX);
    if (!dateMatch) {
        return undefined;
    }
    const timeMatch = time.match(TIME_REGEX);
    if (!timeMatch) {
        return undefined;
    }
    const [_date, year, month, day] = dateMatch;
    const [_time, hours, minutes] = timeMatch;
    const dateTime = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes),
    );
    return dateTime;
}

export { computeDateTime };
