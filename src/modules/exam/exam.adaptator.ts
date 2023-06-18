const examAdaptator = {
    convertExamWithAttemptsToResults,
};

type examWithAttemptsType = {
    id: string;
    name: string;
    questionsChoixMultiple: Array<{ id: number; rightAnswerIndex: number }>;
    attempts: Array<{
        id: string;
        student: { id: string; email: string };
        qcmAnswers: Array<{ choice: number; id: number; questionChoixMultiple: { id: number } }>;
    }>;
};

function convertExamWithAttemptsToResults(examWithAttempts: examWithAttemptsType) {
    const examWithResults = examWithAttempts.attempts.map((attempt) => {
        const choices: Record<number, number> = {};
        const student = attempt.student;
        attempt.qcmAnswers.forEach((qcmAnswer) => {
            const id = qcmAnswer.questionChoixMultiple.id;
            choices[id] = qcmAnswer.choice;
        });
        const mark = examWithAttempts.questionsChoixMultiple.reduce(
            (sum, questionChoixMultiple) =>
                sum +
                (questionChoixMultiple.rightAnswerIndex === choices[questionChoixMultiple.id]
                    ? 1
                    : 0),
            0,
        );
        const result = {
            id: student.id,
            email: student.email,
            attemptId: attempt.id,
            mark,
        };
        return result;
    });
    return examWithResults;
}

export { examAdaptator };
