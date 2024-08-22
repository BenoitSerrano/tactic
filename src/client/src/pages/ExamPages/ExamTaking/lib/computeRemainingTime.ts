// compute remaining time in milliseconds
function computeRemainingTime(
    { startedAt, duration }: { startedAt: string; duration: number | null },
    now: Date,
) {
    if (duration === null) {
        return Infinity;
    }
    const startedAtDate = new Date(startedAt);
    const officialEndTimestamp = startedAtDate.getTime() + duration * 60 * 1000;

    return officialEndTimestamp - now.getTime();
}

export { computeRemainingTime };
