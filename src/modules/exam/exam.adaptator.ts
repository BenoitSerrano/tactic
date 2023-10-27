import { Attempt, attemptUtils } from '../attempt';
import { attemptAdaptator } from '../attempt/attempt.adaptator';
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
        const marks = attemptUtils.aggregateMarks({
            answers,
            marksArray: attempt.marks,
            questions: Object.values(questions),
        });
        const totalMark = Object.values(marks).reduce((sum, mark) => (sum || 0) + (mark || 0), 0);

        const result = {
            id: student.id,
            email: student.email,
            startedAt: startedAtDate.getTime(),
            duration,
            attemptId: attempt.id,
            mark: totalMark,
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

export { examAdaptator };
