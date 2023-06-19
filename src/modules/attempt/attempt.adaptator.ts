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
        startedAt: attempt.startedAt,
        endedAt: attempt.endedAt,
        exam: {
            id: attempt.exam.id,
            name: attempt.exam.name,
            duration: attempt.exam.duration,
            extraTime: attempt.exam.extraTime,
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
