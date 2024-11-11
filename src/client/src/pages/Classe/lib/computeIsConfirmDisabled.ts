function computeIsConfirmDisabled({
    name,
    duration,
    startDateTime,
    endDateTime,
}: {
    name: string;
    duration: string;
    startDateTime: number | undefined;
    endDateTime: number | undefined;
}) {
    if (
        !name ||
        !duration ||
        isNaN(Number(duration)) ||
        Number(duration) === 0 ||
        endDateTime === undefined ||
        startDateTime === undefined
    ) {
        return true;
    }
    return false;
}

export { computeIsConfirmDisabled };
