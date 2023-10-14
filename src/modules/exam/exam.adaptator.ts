import { Attempt, attemptUtils } from '../attempt';
import { attemptAdaptator } from '../attempt/attempt.adaptator';
import { questionAnswerSummaryType } from '../attempt/types';
import { Question } from '../question';
import { Student } from '../student';

const examAdaptator = {
    convertExamWithAttemptsToResults,
};

function convertExamWithAttemptsToResults(
    attempts: Attempt[],
    students: Record<Student['id'], Pick<Student, 'id' | 'email'>>,
    questions: Record<Question['id'], Question>,
) {
    const treatmentStatusSummary = attemptAdaptator.computeTreatmentStatusSummary(attempts);
    const examWithResults = attempts.map((attempt) => {
        const studentId = attempt.student.id;
        const student = students[studentId];
        const startedAtDate = new Date(attempt.startedAt);
        const duration = attempt.updatedAt
            ? Math.floor((new Date(attempt.updatedAt).getTime() - startedAtDate.getTime()) / 1000)
            : undefined;
        const answers = attemptUtils.parseAnswers(attempt.answers);

        const questionAnswerSummary = attemptAdaptator.computeQuestionAnswersSummary(
            answers,
            Object.values(questions),
        );

        const mark = computeMark(Object.values(questionAnswerSummary));

        const result = {
            id: student.id,
            email: student.email,
            startedAt: startedAtDate.getTime(),
            duration,
            attemptId: attempt.id,
            mark,
            hasBeenTreated: treatmentStatusSummary[attempt.id],
            roundTrips: attempt.roundTrips,
            timeSpentOutside: attempt.timeSpentOutside,
        };
        return result;
    });

    const totalPoints = Object.values(questions).reduce(
        (sum, question) => sum + question.points,
        0,
    );
    return { totalPoints, results: examWithResults };
}

function computeMark(questionAnswerSummary: questionAnswerSummaryType) {
    const sum = Object.values(questionAnswerSummary).reduce((sum, { points, status }) => {
        switch (status) {
            case 'right':
                return sum + points;
            case 'acceptable':
                return sum + points / 2;
            default:
                return sum;
        }
    }, 0);
    return sum;
}

export { examAdaptator };
