import { computeIsExamTimeElapsed } from '../../../../lib/computeIsExamTimeElapsed';

function computeShouldNavigateToExamDone(
    now: Date,
    {
        duration,
        startedAt,
        endedAt,
        extraTime,
    }: {
        duration: number | null;
        startedAt: string;
        endedAt: string | undefined;
        extraTime: number;
    },
) {
    if (duration === null) {
        return false;
    }
    const isExamTimeElapsed = computeIsExamTimeElapsed(now, { duration, startedAt, extraTime });
    const hasFinishedExam = !!endedAt;
    return isExamTimeElapsed || hasFinishedExam;
}

export { computeShouldNavigateToExamDone };
