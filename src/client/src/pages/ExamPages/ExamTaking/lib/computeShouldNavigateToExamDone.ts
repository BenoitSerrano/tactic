import { computeIsExamTimeElapsed } from '../../../../lib/computeIsExamTimeElapsed';

function computeShouldNavigateToExamDone(
    now: Date,
    {
        duration,
        startedAt,
        endedAt,
        extraTime,
    }: {
        duration: number;
        startedAt: string;
        endedAt: string | undefined;
        extraTime: number;
    },
) {
    const isExamTimeElapsed = computeIsExamTimeElapsed(now, { duration, startedAt, extraTime });
    const hasFinishedExam = !!endedAt;
    return isExamTimeElapsed || hasFinishedExam;
}

export { computeShouldNavigateToExamDone };
