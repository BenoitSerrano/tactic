import { phraseMelangeeAdaptator } from '../phraseMelangeeAnswer';
import { qcmAnswerAdaptator } from '../qcmAnswer';
import { questionTrouAnswerAdaptator } from '../questionTrouAnswer/questionTrouAnswer.adaptator';
import { Attempt } from './Attempt.entity';

const attemptAdaptator = {
    convertAttemptToAttemptWithAnswers,
    computeTreatmentStatusSummary,
    convertAttemptToAttemptWithoutAnswers,
};

function computeTreatmentStatusSummary(attempts: Attempt[]) {
    const treatmentStatusSummary: Record<string, boolean> = {};
    attempts.forEach((attempt) => {
        treatmentStatusSummary[attempt.id] = attempt.hasBeenTreated;
    });

    return treatmentStatusSummary;
}

function convertAttemptToAttemptWithoutAnswers(attempt: Attempt) {
    const qcmChoices: Record<number, number> = {};
    attempt.qcmAnswers.forEach((qcmAnswer) => {
        const id = qcmAnswer.questionChoixMultiple.id;
        qcmChoices[id] = qcmAnswer.choice;
    });

    const questionTrouAnswers: Record<number, string> = {};
    attempt.questionTrouAnswers.forEach((questionTrouAnswer) => {
        const id = questionTrouAnswer.questionTrou.id;
        questionTrouAnswers[id] = questionTrouAnswer.answer;
    });

    const phraseMelangeeAnswers: Record<number, string> = {};
    attempt.phraseMelangeAnswers.forEach((phraseMelangeAnswer) => {
        const id = phraseMelangeAnswer.phraseMelangee.id;
        phraseMelangeeAnswers[id] = phraseMelangeAnswer.answer;
    });

    return {
        id: attempt.id,
        startedAt: attempt.startedAt,
        updatedAt: attempt.updatedAt,
        exam: {
            id: attempt.exam.id,
            name: attempt.exam.name,
            duration: attempt.exam.duration,
            extraTime: attempt.exam.extraTime,
            questionsChoixMultiple: attempt.exam.questionsChoixMultiple.map(
                (questionChoixMultiple) => ({
                    ...questionChoixMultiple,
                    choice: qcmChoices[questionChoixMultiple.id],
                }),
            ),
            questionsTrou: attempt.exam.questionsTrou.map((questionTrou) => ({
                ...questionTrou,
                answer: questionTrouAnswers[questionTrou.id],
            })),
            phrasesMelangees: attempt.exam.phrasesMelangees.map((phraseMelangee) => ({
                ...phraseMelangee,
                answer: phraseMelangeeAnswers[phraseMelangee.id],
            })),
        },
    };
}

function convertAttemptToAttemptWithAnswers(attempt: Attempt) {
    const qcmSummary = qcmAnswerAdaptator.computeQcmSummary(
        attempt.qcmAnswers,
        attempt.exam.questionsChoixMultiple,
    );
    const questionTrouSummary = questionTrouAnswerAdaptator.computeQuestionTrouSummary(
        attempt.questionTrouAnswers,
        attempt.exam.questionsTrou,
    );

    const phraseMelangeeSummary = phraseMelangeeAdaptator.computePhraseMelangeeSummary(
        attempt.phraseMelangeAnswers,
        attempt.exam.phrasesMelangees,
    );

    return {
        id: attempt.id,
        startedAt: attempt.startedAt,
        updatedAt: attempt.updatedAt,
        exam: {
            id: attempt.exam.id,
            name: attempt.exam.name,
            duration: attempt.exam.duration,
            extraTime: attempt.exam.extraTime,
            questionsChoixMultiple: attempt.exam.questionsChoixMultiple.map(
                (questionChoixMultiple) => ({
                    ...questionChoixMultiple,
                    choice: qcmSummary[questionChoixMultiple.id]?.choice,
                    status: qcmSummary[questionChoixMultiple.id]?.status,
                }),
            ),
            questionsTrou: attempt.exam.questionsTrou.map((questionTrou) => ({
                ...questionTrou,
                answer: questionTrouSummary[questionTrou.id]?.answer,
                status: questionTrouSummary[questionTrou.id]?.status,
            })),
            phrasesMelangees: attempt.exam.phrasesMelangees.map((phraseMelangee) => ({
                ...phraseMelangee,
                answer: phraseMelangeeSummary[phraseMelangee.id]?.answer,
                status: phraseMelangeeSummary[phraseMelangee.id]?.status,
            })),
        },
    };
}

export { attemptAdaptator };
