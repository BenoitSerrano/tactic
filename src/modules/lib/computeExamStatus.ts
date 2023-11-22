import { Attempt, attemptUtils } from '../attempt';
import { Exam } from '../exam';
type attemptStatusType = 'notStarted' | 'pending' | 'expired' | 'finished';

function computeExamStatus(
    exams: Record<Exam['id'], Pick<Exam, 'id' | 'name' | 'duration' | 'extraTime'>>,
    attempts: Array<{
        endedAt: Attempt['endedAt'];
        startedAt: Attempt['startedAt'];
        exam: Pick<Exam, 'id'>;
    }>,
    now: Date,
) {
    const examStatus: Record<string, attemptStatusType> = {};
    Object.keys(exams).forEach((examId) => {
        examStatus[examId] = 'notStarted';
    });
    attempts.forEach((attempt) => {
        const status = computeAttemptStatus(attempt, exams[attempt.exam.id], now);

        examStatus[attempt.exam.id] = status;
    });
    return examStatus;
}

function computeAttemptStatus(
    attempt: Pick<Attempt, 'endedAt' | 'startedAt'>,
    exam: Pick<Exam, 'duration' | 'extraTime'>,
    now: Date,
) {
    let status: attemptStatusType = 'notStarted';
    if (!!attempt.endedAt) {
        status = 'finished';
    } else {
        const { duration, extraTime } = exam;
        const isTimeLimitExceeded = attemptUtils.computeIsTimeLimitExceeded({
            now,
            duration,
            extraTime,
            startedAt: attempt.startedAt,
        });
        if (isTimeLimitExceeded) {
            status = 'expired';
        } else {
            status = 'pending';
        }
    }
    return status;
}

export { computeExamStatus, computeAttemptStatus };
