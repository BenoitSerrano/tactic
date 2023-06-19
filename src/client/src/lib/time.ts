function formatToClock(seconds: number) {
    if (seconds < 0) {
        return `00:00:00`;
    }
    const hours = Math.floor(seconds / 3600);
    seconds = seconds - hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;

    return `${formatToHumanReadable(hours)}:${formatToHumanReadable(
        minutes,
    )}:${formatToHumanReadable(seconds)}`;
}

function formatToHumanReadable(value: number) {
    return value >= 10 ? value : `0${value}`;
}

function computeElapsedTime(date: string, now: Date) {
    const referenceDate = new Date(date);
    return Math.floor((now.getTime() - referenceDate.getTime()) / 1000);
}

export { formatToClock, computeElapsedTime };
