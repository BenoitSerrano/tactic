import { Attempt, attemptUtils } from '../attempt';
import { computeAttemptStatus } from '../lib/computeExamStatus';
import { Question } from '../question';
import { questionDtoType } from '../question/types';
import { Student } from '../student';
import { Exam } from './Exam.entity';

const examAdaptator = {
    convertExamWithAttemptsToResults,
};

function convertExamWithAttemptsToResults(
    attempts: Attempt[],
    students: Record<Student['id'], Pick<Student, 'id' | 'email'>>,
    exam: {
        name: Exam['name'];
        duration: Exam['duration'];
        extraTime: Exam['extraTime'];
        questions: Record<Question['id'], questionDtoType>;
    },
) {
    const now = new Date();
    const examWithResults = attempts.map((attempt) => {
        const studentId = attempt.student.id;
        const student = students[studentId];
        const startedAtDate = new Date(attempt.startedAt);
        const actualDuration = attempt.updatedAt
            ? Math.floor((new Date(attempt.updatedAt).getTime() - startedAtDate.getTime()) / 1000)
            : undefined;
        const answers = attemptUtils.parseAnswers(attempt.answers);
        const totalMark = Object.values(exam.questions)
            .map((question) => {
                const { mark } = attemptUtils.computeNotationInfo({
                    answers,
                    manualMarks: attempt.manualMarks,
                    question,
                });
                return mark || 0;
            })
            .reduce((sum, mark) => sum + mark, 0);

        const { extraTime, duration } = exam;
        const isTimeLimitExceeded = attemptUtils.computeIsTimeLimitExceeded({
            startedAt: attempt.startedAt,
            extraTime,
            duration,
            now,
        });
        const attemptStatus = computeAttemptStatus(attempt, { extraTime, duration }, now);
        const result = {
            id: student.id,
            email: student.email,
            startedAt: attempt.startedAt,
            actualDuration,
            attemptId: attempt.id,
            mark: totalMark,
            isTimeLimitExceeded,
            attemptStatus,
            roundTrips: attempt.roundTrips,
            timeSpentOutside: attempt.timeSpentOutside,
        };
        return result;
    });

    const totalPoints = Object.values(exam.questions).reduce(
        (sum, question) => sum + question.points,
        0,
    );
    return { totalPoints, results: examWithResults, examName: exam.name };
}

export { examAdaptator };
