import { QuestionChoixMultiple } from '../questionChoixMultiple';
import { QcmAnswer } from './QcmAnswer.entity';

const qcmAnswerAdaptator = {
    computeQcmSummary,
};
type qcmChoicesType = Record<number, number>;

function computeQcmSummary(
    qcmAnswers: QcmAnswer[],
    questionsChoixMultiple: QuestionChoixMultiple[],
) {
    const choices: qcmChoicesType = {};

    qcmAnswers.forEach((qcmAnswer) => {
        const id = qcmAnswer.questionChoixMultiple.id;
        choices[id] = qcmAnswer.choice;
    });

    const qcmSummary = {} as any;
    questionsChoixMultiple.forEach((questionChoixMultiple) => {
        qcmSummary[questionChoixMultiple.id] = {
            choice: choices[questionChoixMultiple.id],
            points: questionChoixMultiple.points,
            status:
                questionChoixMultiple.rightAnswerIndex === choices[questionChoixMultiple.id]
                    ? ('right' as const)
                    : ('wrong' as const),
        };
    });
    return qcmSummary;
}

export { qcmAnswerAdaptator };
