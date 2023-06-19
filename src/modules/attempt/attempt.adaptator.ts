const attemptAdaptator = {
    convertAttemptToAttemptWithChoices,
};

function convertAttemptToAttemptWithChoices(attempt: any) {
    const choices: Record<number, number> = {};
    attempt.qcmAnswers.forEach(
        (qcmAnswer: { questionChoixMultiple: { id: number }; choice: number }) => {
            const id = qcmAnswer.questionChoixMultiple.id;
            choices[id] = qcmAnswer.choice;
        },
    );

    return {
        id: attempt.id,
        createdAt: attempt.createdAt,
        endedAt: attempt.endedAt,
        exam: {
            id: attempt.exam.id,
            name: attempt.exam.name,
            questionsChoixMultiple: attempt.exam.questionsChoixMultiple.map(
                (questionChoixMultiple: { id: number }) => ({
                    ...questionChoixMultiple,
                    choice: choices[questionChoixMultiple.id],
                }),
            ),
        },
    };
    return {};
}

export { attemptAdaptator };
