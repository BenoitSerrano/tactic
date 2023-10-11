import { Attempt, attemptUtils } from '../attempt';
import { attemptAdaptator } from '../attempt/attempt.adaptator';
import { PhraseMelangee } from '../phraseMelangee';
import { phraseMelangeeAdaptator } from '../phraseMelangeeAnswer';
import { qcmAnswerAdaptator } from '../qcmAnswer';
import { QuestionChoixMultiple } from '../questionChoixMultiple';
import { QuestionTrou } from '../questionTrou';
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

        const qcmSummary = qcmAnswerAdaptator.computeQcmSummary(
            answers.qcmChoices,
            Object.values(questions.questionsChoixMultiple),
        );

        const questionTrouSummary = questionTrouAnswerAdaptator.computeQuestionTrouSummary(
            answers.questionTrouAnswers,
            Object.values(questions.questionsTrou),
        );

        const phraseMelangeeSummary = phraseMelangeeAdaptator.computePhraseMelangeeSummary(
            answers.phraseMelangeeAnswers,
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
