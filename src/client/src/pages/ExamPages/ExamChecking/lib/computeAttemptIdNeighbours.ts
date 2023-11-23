function computeAttemptIdNeighbours(attemptId: string, searchAttemptIds: string) {
    let previous: string | undefined = undefined;
    let next: string | undefined = undefined;
    if (!searchAttemptIds) {
        return { previous, next };
    }

    const attemptIds = searchAttemptIds.split(',');
    const attemptIndex = attemptIds.indexOf(attemptId);
    if (attemptIndex === -1) {
        return { previous, next };
    }
    if (attemptIndex > 0) {
        previous = attemptIds[attemptIndex - 1];
    }
    if (attemptIndex < attemptIds.length - 1) {
        next = attemptIds[attemptIndex + 1];
    }
    return { previous, next };
}

export { computeAttemptIdNeighbours };
