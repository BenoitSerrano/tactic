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

    return {
        id: attempt.id,
        startedAt: attempt.startedAt,
        endedAt: attempt.endedAt,
        exam: {
            id: attempt.exam.id,
            name: attempt.exam.name,
            duration: attempt.exam.duration,
            extraTime: attempt.exam.extraTime,
            questionsChoixMultiple: attempt.exam.questionsChoixMultiple.map(
                (questionChoixMultiple) => ({
                    ...questionChoixMultiple,
                    choice: choices[questionChoixMultiple.id],
                }),
            ),
            questionsTrou: attempt.exam.questionsTrou.map((questionTrou) => ({
                ...questionTrou,
                answer: answers[questionTrou.id],
            })),
        },
    };
}

export { attemptAdaptator };
