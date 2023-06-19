import { Attempt } from './Attempt.entity';

const attemptUtils = { isTimeLimitExceeded };

function isTimeLimitExceeded(attempt: Attempt, now: Date) {
    const attemptStartedDate = new Date(attempt.startedAt);

    const elapsedSeconds = Math.floor((now.getTime() - attemptStartedDate.getTime()) / 1000);
    const extendedAllowedTime = (attempt.exam.duration + attempt.exam.extraTime) * 60;

    return elapsedSeconds > extendedAllowedTime;
}

export { attemptUtils };
