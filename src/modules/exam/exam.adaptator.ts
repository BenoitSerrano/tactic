import { attemptAdaptator } from '../attempt/attempt.adaptator';
import { phraseMelangeeAdaptator } from '../phraseMelangeeAnswer';
import { qcmAnswerAdaptator } from '../qcmAnswer';
import { questionTrouAnswerAdaptator } from '../questionTrouAnswer/questionTrouAnswer.adaptator';
import { Exam } from './Exam.entity';

const examAdaptator = {
    convertExamWithAttemptsToResults,
};

function convertExamWithAttemptsToResults(examWithAttempts: Exam) {
    const treatmentStatusSummary = attemptAdaptator.computeTreatmentStatusSummary(
        examWithAttempts.attempts,
    );
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
        const phraseMelangeeSummary = phraseMelangeeAdaptator.computePhraseMelangeeSummary(
            attempt.phraseMelangeAnswers,
            examWithAttempts.phrasesMelangees,
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
            phraseMelangeeSummary,
            hasBeenTreated: treatmentStatusSummary[attempt.id],
        };
        return result;
    });
    const qcmTotalPoints = examWithAttempts.questionsChoixMultiple.reduce(
        (sum, summary) => sum + summary.points,
        0,
    );
    const questionTrouTotalPoints = examWithAttempts.questionsTrou.reduce(
        (sum, summary) => sum + summary.points,
        0,
    );
    const phraseMelangeeTotalPoints = examWithAttempts.phrasesMelangees.reduce(
        (sum, summary) => sum + summary.points,
        0,
    );
    const totalPoints = qcmTotalPoints + questionTrouTotalPoints + phraseMelangeeTotalPoints;
    return { totalPoints, results: examWithResults };
}

export { examAdaptator };
