import { phraseMelangeeAdaptator } from '../phraseMelangeeAnswer';
import { qcmAnswerAdaptator } from '../qcmAnswer';
import { questionTrouAnswerAdaptator } from '../questionTrouAnswer/questionTrouAnswer.adaptator';
import { Attempt } from './Attempt.entity';

const attemptAdaptator = {
    convertAttemptToAttemptWithAnswers,
};

function convertAttemptToAttemptWithAnswers(attempt: Attempt) {
    const choices: Record<number, number> = {};
    attempt.qcmAnswers.forEach((qcmAnswer) => {
        const id = qcmAnswer.questionChoixMultiple.id;
        choices[id] = qcmAnswer.choice;
    });

    const answers: Record<number, string> = {};
    attempt.questionTrouAnswers.forEach((questionTrouAnswer) => {
        const id = questionTrouAnswer.questionTrou.id;
        answers[id] = questionTrouAnswer.answer;
    });

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
                shuffledCombination: phraseMelangee.shuffledCombination.map((value) =>
                    Number(value),
                ),
                combination: phraseMelangeeSummary[phraseMelangee.id].combination,
            })),
        },
    };
}

export { attemptAdaptator };
