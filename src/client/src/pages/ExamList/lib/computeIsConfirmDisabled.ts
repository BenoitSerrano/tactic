function computeIsConfirmDisabled({
    name,
    duration,
    selectedClasseId,
    startDateTime,
    endDateTime,
}: {
    name: string;
    duration: string;
    selectedClasseId: string | undefined;
    startDateTime: number | undefined;
    endDateTime: number | undefined;
}) {
    if (
        !name ||
        !duration ||
        isNaN(Number(duration)) ||
        Number(duration) === 0 ||
        !selectedClasseId ||
        endDateTime === undefined ||
        startDateTime === undefined
    ) {
        return true;
    }
    return false;
}

export { computeIsConfirmDisabled };
