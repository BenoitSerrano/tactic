import { Attempt, attemptUtils } from '../attempt';
import { Exam } from '../exam';
import { questionDtoType } from '../question/types';
type attemptStatusType = 'notStarted' | 'pending' | 'expired' | 'finished' | 'corrected';

function computeExamStatus(
    exams: Record<Exam['id'], Pick<Exam, 'id' | 'name' | 'duration' | 'extraTime'>>,
    attempts: Array<{
        id: Attempt['id'];
        endedAt: Attempt['endedAt'];
        answers: Attempt['answers'];
        manualMarks: Attempt['manualMarks'];
        startedAt: Attempt['startedAt'];
        correctedAt: Attempt['correctedAt'];
        exam: Pick<Exam, 'id'>;
    }>,
    questionsByExamId: Record<Exam['id'], questionDtoType[]>,
    now: Date,
) {
    const examStatus: Record<
        string,
        { attemptStatus: attemptStatusType; mark: number; attemptId: Attempt['id'] | undefined }
    > = {};
    Object.keys(exams).forEach((examId) => {
        examStatus[examId] = { attemptStatus: 'notStarted', mark: 0, attemptId: undefined };
    });
    attempts.forEach((attempt) => {
        const status = computeAttemptStatus(attempt, exams[attempt.exam.id], now);
        const answers = attemptUtils.parseAnswers(attempt.answers);
        const questions = questionsByExamId[attempt.exam.id] || [];
        const totalMark = Object.values(questions)
            .map((question) => {
                const { mark } = attemptUtils.computeNotationInfo({
                    answers,
                    manualMarks: attempt.manualMarks,
                    question,
                });
                return mark || 0;
            })
            .reduce((sum, mark) => sum + mark, 0);
        examStatus[attempt.exam.id] = {
            attemptStatus: status,
            mark: totalMark,
            attemptId: attempt.id,
        };
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
