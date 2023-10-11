import { QuestionChoixMultiple } from '../questionChoixMultiple';

const qcmAnswerAdaptator = {
    computeQcmSummary,
};
type qcmChoicesType = Record<number, number>;

function computeQcmSummary(
    choices: qcmChoicesType,
    questionsChoixMultiple: QuestionChoixMultiple[],
) {
    const qcmSummary = {} as any;
    questionsChoixMultiple.forEach((questionChoixMultiple) => {
        qcmSummary[questionChoixMultiple.id] = {
            choice: choices[questionChoixMultiple.id],
            points: questionChoixMultiple.points,
            status:
                questionChoixMultiple.rightAnswerIndex == choices[questionChoixMultiple.id]
                    ? ('right' as const)
                    : ('wrong' as const),
        };
    });
    return qcmSummary;
}

export { qcmAnswerAdaptator };
