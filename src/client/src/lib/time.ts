import { localeInfo } from '../constants';

const time = {
    formatToClock,
    computeElapsedTime,
    formatToReadableDatetime,
    formatToReadableTime,
};

function formatToClock(seconds: number, options?: { hideHours: boolean }) {
    if (seconds < 0) {
        return `${options?.hideHours ? '' : '00:'}00:00`;
    }
    const hours = Math.floor(seconds / 3600);
    seconds = seconds - hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;

    let humanReadableHours = '';
    if (hours > 0) {
        humanReadableHours = formatToHumanReadable(hours) + ':';
    } else if (!options?.hideHours) {
        humanReadableHours = '00:';
    }

    return `${humanReadableHours}${formatToHumanReadable(minutes)}:${formatToHumanReadable(
        seconds,
    )}`;
}

function formatToReadableDatetime(date: string) {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleString(localeInfo.locale, { timeZone: localeInfo.timeZone });
}

function formatToReadableTime(date: string, options?: { hideSeconds?: boolean }) {
    const parsedDate = new Date(date);
    const readableTime = parsedDate.toLocaleTimeString(localeInfo.locale, {
        timeZone: localeInfo.timeZone,
    });
    if (options?.hideSeconds) {
        return readableTime.substring(0, readableTime.length - 3);
    }
    return readableTime;
}

function formatToHumanReadable(value: number) {
    return value >= 10 ? `${value}` : `0${value}`;
}

function computeElapsedTime(date: string, now: Date) {
    const referenceDate = new Date(date);
    return Math.floor((now.getTime() - referenceDate.getTime()) / 1000);
}

export { time };
