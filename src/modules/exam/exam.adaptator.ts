import { Attempt, attemptUtils } from '../attempt';
import { computeAttemptStatus } from '../lib/computeExamStatus';
import { Question } from '../question';
import { Student } from '../student';
import { Exam } from './Exam.entity';

const examAdaptator = {
    convertExamWithAttemptsToResults,
};

function convertExamWithAttemptsToResults(
    attempts: Attempt[],
    students: Record<Student['id'], Pick<Student, 'id' | 'email'>>,
    exam: {
        duration: Exam['duration'];
        extraTime: Exam['extraTime'];
        questions: Record<Question['id'], Question>;
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
        const marks = attemptUtils.aggregateMarks({
            answers,
            marksArray: attempt.marks,
            questions: Object.values(exam.questions),
        });
        const { extraTime, duration } = exam;
        const totalMark = Object.values(marks).reduce((sum, mark) => (sum || 0) + (mark || 0), 0);
        const attemptStatus = computeAttemptStatus(attempt, { extraTime, duration }, now);
        const result = {
            id: student.id,
            email: student.email,
            startedAt: attempt.startedAt,
            actualDuration,
            attemptId: attempt.id,
            mark: totalMark,
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
    return { totalPoints, results: examWithResults };
}

export { examAdaptator };
