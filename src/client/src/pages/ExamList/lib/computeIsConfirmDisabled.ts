function computeIsConfirmDisabled({
    name,
    duration,
    selectedClasseId,
}: {
    name: string;
    duration: string;
    selectedClasseId: string | undefined;
}) {
    if (
        !name ||
        !duration ||
        isNaN(Number(duration)) ||
        Number(duration) === 0 ||
        !selectedClasseId
    ) {
        return true;
    }
    return false;
}

export { computeIsConfirmDisabled };
