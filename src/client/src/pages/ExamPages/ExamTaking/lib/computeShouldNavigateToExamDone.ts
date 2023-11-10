import { time } from '../../../../lib/time';

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
    let remainingSeconds = duration * 60 - time.computeElapsedTime(startedAt, now);
    const isTimeElapsed = remainingSeconds + extraTime * 60 < 0;
    const hasFinishedExam = !!endedAt;
    return isTimeElapsed || hasFinishedExam;
}

export { computeShouldNavigateToExamDone };
