import { Attempt, attemptUtils } from '../attempt';
import { Exam } from '../exam';
type attemptStatusType = 'notStarted' | 'pending' | 'expired' | 'finished' | 'corrected';

function computeExamStatus(
    exams: Record<Exam['id'], Pick<Exam, 'id' | 'name' | 'duration' | 'extraTime'>>,
    attempts: Array<{
        endedAt: Attempt['endedAt'];
        startedAt: Attempt['startedAt'];
        correctedAt: Attempt['correctedAt'];
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
    attempt: Pick<Attempt, 'endedAt' | 'startedAt' | 'correctedAt'>,
    exam: Pick<Exam, 'duration' | 'extraTime'>,
    now: Date,
) {
    if (!!attempt.correctedAt) {
        return 'corrected';
    }

    if (!!attempt.endedAt) {
        return 'finished';
    } else {
        const { duration, extraTime } = exam;
        const isTimeLimitExceeded = attemptUtils.computeIsTimeLimitExceeded({
            now,
            duration,
            extraTime,
            startedAt: attempt.startedAt,
        });
        if (isTimeLimitExceeded) {
            return 'expired';
        } else {
            return 'pending';
        }
    }
}

export { computeExamStatus, computeAttemptStatus };
