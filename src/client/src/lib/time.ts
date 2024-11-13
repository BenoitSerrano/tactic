import { localeInfo } from '../constants';

const time = {
    formatToClock,
    computeElapsedTime,
    formatToReadableTime,
    addSeconds,
    formatToReadable,
    formatToIsoFormat,
};

function addSeconds(date: string, seconds: number) {
    const parsedDate = new Date(date);
    parsedDate.setTime(parsedDate.getTime() + seconds * 1000);
    return parsedDate;
}

function formatToIsoFormat(timestamp: number) {
    const date = new Date(timestamp);
    const isoDate = date.toISOString().slice(0, 10);
    const isoTime = date.toLocaleTimeString().slice(0, 5);

    return { date: isoDate, time: isoTime };
}

function formatToReadable(date: Date, options?: { shouldDisplayTime?: boolean }) {
    let result = '';
    const now = new Date();

    if (
        date.toLocaleDateString(localeInfo.locale, {
            timeZone: localeInfo.timeZone,
        }) ===
        now.toLocaleDateString(localeInfo.locale, {
            timeZone: localeInfo.timeZone,
        })
    ) {
        result += "Aujourd'hui ";
    } else {
        result += date.toLocaleDateString(localeInfo.locale, {
            timeZone: localeInfo.timeZone,
        });
    }

    if (options?.shouldDisplayTime) {
        result += date.toLocaleTimeString(localeInfo.locale, {
            timeZone: localeInfo.timeZone,
            timeStyle: 'short',
        });
    }

    return result;
}

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
