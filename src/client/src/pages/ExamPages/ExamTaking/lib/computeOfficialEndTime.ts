import { localeInfo } from '../../../../constants';

function computeOfficialEndTime({ startedAt, duration }: { startedAt: string; duration: number }) {
    const startedAtDate = new Date(startedAt);
    const durationInMilliseconds = duration * 60 * 1000;
    const officialEndDate = new Date();
    officialEndDate.setTime(startedAtDate.getTime() + durationInMilliseconds);
    const [hours, minutes] = officialEndDate
        .toLocaleTimeString(localeInfo.locale, {
            timeZone: localeInfo.timeZone,
        })
        .split(':');
    const officialEndTime = `${hours}:${minutes}`;
    return officialEndTime;
}

export { computeOfficialEndTime };
