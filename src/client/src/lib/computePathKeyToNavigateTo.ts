function computePathKeyToNavigateTo<attemptT extends { id: string; correctedAt: string | null }>(
    attempt: attemptT | undefined,
) {
    if (!attempt) {
        return 'STUDENT_HOME';
    }
    if (!!attempt.correctedAt) {
        return 'EXAM_CONSULTING';
    } else {
        return 'EXAM_TAKING';
    }
}

export { computePathKeyToNavigateTo };
