import { Exam } from './Exam.entity';

const examAdaptator = {
    convertExamWithAttemptsToResults,
};

// type examWithAttemptsType = {
//     id: string;
//     name: string;
//     questionsChoixMultiple: Array<{ id: number; rightAnswerIndex: number }>;
//     attempts: Array<{
//         id: string;
//         startedAt: string;
//         endedAt: string | undefined;
//         student: { id: string; email: string };
//         qcmAnswers: Array<{ choice: number; id: number; questionChoixMultiple: { id: number } }>;
//     }>;
// };

function convertExamWithAttemptsToResults(examWithAttempts: Exam) {
    const examWithResults = examWithAttempts.attempts.map((attempt) => {
        const choices: Record<number, number> = {};
        const answers: Record<number, string> = {};
        const student = attempt.student;
        attempt.qcmAnswers.forEach((qcmAnswer) => {
            const id = qcmAnswer.questionChoixMultiple.id;
            choices[id] = qcmAnswer.choice;
        });
        attempt.questionTrouAnswers.forEach((questionTrouAnswer) => {
            const id = questionTrouAnswer.questionTrou.id;
            answers[id] = questionTrouAnswer.answer;
        });
        const qcmMark = examWithAttempts.questionsChoixMultiple.reduce(
            (sum, questionChoixMultiple) =>
                sum +
                (questionChoixMultiple.rightAnswerIndex === choices[questionChoixMultiple.id]
                    ? 1
                    : 0),
            0,
        );
        const questionTrouMark = examWithAttempts.questionsTrou.reduce((sum, questionTrou) => {
            if (questionTrou.rightAnswer === answers[questionTrou.id]) {
                return sum + 1;
            } else if (
                questionTrou.acceptableAnswers.some(
                    (acceptableAnswer) => acceptableAnswer === answers[questionTrou.id],
                )
            ) {
                return sum + 0.5;
            } else {
                return sum;
            }
        }, 0);
        const startedAtDate = new Date(attempt.startedAt);
        const duration = attempt.endedAt
            ? Math.floor((new Date(attempt.endedAt).getTime() - startedAtDate.getTime()) / 1000)
            : undefined;
        const totalPoints =
            examWithAttempts.questionsChoixMultiple.length + examWithAttempts.questionsTrou.length;
        const result = {
            id: student.id,
            email: student.email,
            startedAt: startedAtDate.getTime(),
            duration,
            attemptId: attempt.id,
            mark: qcmMark + questionTrouMark,
            totalPoints,
        };
        return result;
    });
    return examWithResults;
}

export { examAdaptator };
