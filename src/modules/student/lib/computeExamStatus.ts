import { Attempt, attemptUtils } from '../../attempt';
import { Exam } from '../../exam';
import { examStatusType } from '../types';

function computeExamStatus(
    exams: Record<Exam['id'], Pick<Exam, 'id' | 'name' | 'duration' | 'extraTime'>>,
    attempts: Array<{
        endedAt?: Attempt['endedAt'];
        startedAt: Attempt['startedAt'];
        exam: Pick<Exam, 'id'>;
    }>,
    now: Date,
) {
    const examStatus: Record<string, examStatusType> = {};
    Object.keys(exams).forEach((examId) => {
        examStatus[examId] = 'notStarted';
    });
    attempts.forEach((attempt) => {
        let status: examStatusType = 'notStarted';
        if (!!attempt.endedAt) {
            status = 'finished';
        } else {
            const { duration, extraTime } = exams[attempt.exam.id];
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

        examStatus[attempt.exam.id] = status;
    });
    return examStatus;
}

export { computeExamStatus };
