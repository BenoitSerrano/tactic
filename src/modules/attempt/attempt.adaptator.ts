import { Exam } from '../exam';
import { phraseMelangeeAnswersType } from '../phraseMelangee';
import { PhraseMelangeeAnswer, phraseMelangeeAdaptator } from '../phraseMelangeeAnswer';
import { QcmAnswer, qcmAnswerAdaptator, qcmChoicesType } from '../qcmAnswer';
import { QuestionTrouAnswer } from '../questionTrouAnswer';
import { questionTrouAnswerAdaptator } from '../questionTrouAnswer/questionTrouAnswer.adaptator';
import { questionTrouAnswersType } from '../questionTrouAnswer/types';
import { Attempt } from './Attempt.entity';
import { attemptAnswersType } from './types';

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

function convertAttemptToAttemptWithoutAnswers(
    attempt: Attempt,
    exam: Exam,
    attemptAnswers: attemptAnswersType,
) {
    return {
        id: attempt.id,
        startedAt: attempt.startedAt,
        updatedAt: attempt.updatedAt,
        exam: {
            id: exam.id,
            name: exam.name,
            duration: exam.duration,
            extraTime: exam.extraTime,
            questionsChoixMultiple: exam.questionsChoixMultiple.map((questionChoixMultiple) => ({
                id: questionChoixMultiple.id,
                title: questionChoixMultiple.title,
                possibleAnswers: questionChoixMultiple.possibleAnswers,
                choice: attemptAnswers.qcmChoices[questionChoixMultiple.id],
            })),
            questionsTrou: exam.questionsTrou.map((questionTrou) => ({
                id: questionTrou.id,
                beforeText: questionTrou.beforeText,
                afterText: questionTrou.afterText,
                answer: attemptAnswers.questionTrouAnswers[questionTrou.id],
            })),
            phrasesMelangees: exam.phrasesMelangees.map((phraseMelangee) => ({
                id: phraseMelangee.id,
                words: phraseMelangee.words,
                shuffledPhrase: phraseMelangee.shuffledPhrase,
                answer: attemptAnswers.phraseMelangeeAnswers[phraseMelangee.id],
            })),
        },
    };
}

function convertAttemptToAttemptWithAnswers(
    attempt: Attempt,
    exam: Exam,
    answers: attemptAnswersType,
) {
    const qcmSummary = qcmAnswerAdaptator.computeQcmSummary(
        answers.qcmChoices,
        exam.questionsChoixMultiple,
    );
    const questionTrouSummary = questionTrouAnswerAdaptator.computeQuestionTrouSummary(
        answers.questionTrouAnswers,
        exam.questionsTrou,
    );

    const phraseMelangeeSummary = phraseMelangeeAdaptator.computePhraseMelangeeSummary(
        answers.phraseMelangeeAnswers,
        exam.phrasesMelangees,
    );

    return {
        id: attempt.id,
        startedAt: attempt.startedAt,
        updatedAt: attempt.updatedAt,
        exam: {
            id: exam.id,
            name: exam.name,
            duration: exam.duration,
            extraTime: exam.extraTime,
            questionsChoixMultiple: exam.questionsChoixMultiple.map((questionChoixMultiple) => ({
                ...questionChoixMultiple,
                choice: qcmSummary[questionChoixMultiple.id]?.choice,
                status: qcmSummary[questionChoixMultiple.id]?.status,
            })),
            questionsTrou: exam.questionsTrou.map((questionTrou) => ({
                ...questionTrou,
                answer: questionTrouSummary[questionTrou.id]?.answer,
                status: questionTrouSummary[questionTrou.id]?.status,
            })),
            phrasesMelangees: exam.phrasesMelangees.map((phraseMelangee) => ({
                ...phraseMelangee,
                answer: phraseMelangeeSummary[phraseMelangee.id]?.answer,
                status: phraseMelangeeSummary[phraseMelangee.id]?.status,
            })),
        },
    };
}

export { attemptAdaptator };
