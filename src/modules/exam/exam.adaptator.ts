import { qcmAnswerAdaptator } from '../qcmAnswer';
import { questionTrouAnswerAdaptator } from '../questionTrouAnswer/questionTrouAnswer.adaptator';
import { Exam } from './Exam.entity';

const examAdaptator = {
    convertExamWithAttemptsToResults,
};

function convertExamWithAttemptsToResults(examWithAttempts: Exam) {
    const examWithResults = examWithAttempts.attempts.map((attempt) => {
        const student = attempt.student;
        const startedAtDate = new Date(attempt.startedAt);
        const duration = attempt.updatedAt
            ? Math.floor((new Date(attempt.updatedAt).getTime() - startedAtDate.getTime()) / 1000)
            : undefined;
        const questionTrouSummary = questionTrouAnswerAdaptator.computeQuestionTrouSummary(
            attempt.questionTrouAnswers,
            examWithAttempts.questionsTrou,
        );
        const qcmSummary = qcmAnswerAdaptator.computeQcmSummary(
            attempt.qcmAnswers,
            examWithAttempts.questionsChoixMultiple,
        );

        const result = {
            id: student.id,
            email: student.email,
            comment: student.comment,
            startedAt: startedAtDate.getTime(),
            duration,
            attemptId: attempt.id,
            questionTrouSummary,
            qcmSummary,
        };
        return result;
    });
    return examWithResults;
}

export { examAdaptator };
