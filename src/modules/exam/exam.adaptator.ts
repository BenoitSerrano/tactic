import { Attempt } from '../attempt';
import { attemptAdaptator } from '../attempt/attempt.adaptator';
import { PhraseMelangee } from '../phraseMelangee';
import { PhraseMelangeeAnswer, phraseMelangeeAdaptator } from '../phraseMelangeeAnswer';
import { QcmAnswer, qcmAnswerAdaptator } from '../qcmAnswer';
import { QuestionChoixMultiple } from '../questionChoixMultiple';
import { QuestionTrou } from '../questionTrou';
import { QuestionTrouAnswer } from '../questionTrouAnswer';
import { questionTrouAnswerAdaptator } from '../questionTrouAnswer/questionTrouAnswer.adaptator';
import { Student } from '../student';

const examAdaptator = {
    convertExamWithAttemptsToResults,
};

function convertExamWithAttemptsToResults(
    attempts: Attempt[],
    students: Record<Student['id'], Pick<Student, 'id' | 'email'>>,
    questions: {
        questionsChoixMultiple: Record<QuestionChoixMultiple['id'], QuestionChoixMultiple>;
        questionsTrou: Record<QuestionTrou['id'], QuestionTrou>;
        phrasesMelangees: Record<PhraseMelangee['id'], PhraseMelangee>;
    },
    answers: {
        qcmAnswers: Record<QcmAnswer['id'], QcmAnswer>;
        questionTrouAnswers: Record<QuestionTrouAnswer['id'], QuestionTrouAnswer>;
        phraseMelangeeAnswers: Record<PhraseMelangeeAnswer['id'], PhraseMelangeeAnswer>;
    },
) {
    const treatmentStatusSummary = attemptAdaptator.computeTreatmentStatusSummary(attempts);
    const examWithResults = attempts.map((attempt) => {
        const studentId = attempt.student.id;
        const student = students[studentId];
        const startedAtDate = new Date(attempt.startedAt);
        const duration = attempt.updatedAt
            ? Math.floor((new Date(attempt.updatedAt).getTime() - startedAtDate.getTime()) / 1000)
            : undefined;
        const qcmAnswers = attempt.qcmAnswers.map(({ id }) => answers.qcmAnswers[id]);
        const qcmSummary = qcmAnswerAdaptator.computeQcmSummary(
            qcmAnswers,
            Object.values(questions.questionsChoixMultiple),
        );

        const questionTrouAnswers = attempt.questionTrouAnswers.map(
            ({ id }) => answers.questionTrouAnswers[id],
        );
        const questionTrouSummary = questionTrouAnswerAdaptator.computeQuestionTrouSummary(
            questionTrouAnswers,
            Object.values(questions.questionsTrou),
        );

        const phraseMelangeeAnswers = attempt.phraseMelangeAnswers.map(
            ({ id }) => answers.phraseMelangeeAnswers[id],
        );
        const phraseMelangeeSummary = phraseMelangeeAdaptator.computePhraseMelangeeSummary(
            phraseMelangeeAnswers,
            Object.values(questions.phrasesMelangees),
        );

        const mark = computeMark([questionTrouSummary, qcmSummary, phraseMelangeeSummary]);

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
    const qcmTotalPoints = Object.values(questions.questionsChoixMultiple).reduce(
        (sum, summary) => sum + summary.points,
        0,
    );
    const questionTrouTotalPoints = Object.values(questions.questionsTrou).reduce(
        (sum, summary) => sum + summary.points,
        0,
    );
    const phraseMelangeeTotalPoints = Object.values(questions.phrasesMelangees).reduce(
        (sum, summary) => sum + summary.points,
        0,
    );
    const totalPoints = qcmTotalPoints + questionTrouTotalPoints + phraseMelangeeTotalPoints;
    return { totalPoints, results: examWithResults };
}

function computeMark<summaryT extends { status: 'right' | 'acceptable' | 'wrong'; points: number }>(
    summaries: Array<Record<number, summaryT>>,
) {
    let sum = 0;

    summaries.forEach((summary) => {
        Object.values(summary).forEach(({ points, status }) => {
            switch (status) {
                case 'right':
                    sum += points;
                    break;
                case 'acceptable':
                    sum += points / 2;
                    break;
            }
        });
    });
    return sum;
}

export { examAdaptator };
