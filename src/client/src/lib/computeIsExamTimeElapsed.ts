import { time } from './time';

function computeIsExamTimeElapsed(
    now: Date,
    exam: {
        duration: number;
        startedAt: string;
        extraTime: number;
    },
) {
    let remainingSeconds = exam.duration * 60 - time.computeElapsedTime(exam.startedAt, now);
    const isExamTimeElapsed = remainingSeconds + exam.extraTime * 60 < 0;
    return isExamTimeElapsed;
}

export { computeIsExamTimeElapsed };
