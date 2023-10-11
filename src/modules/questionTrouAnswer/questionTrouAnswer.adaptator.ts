import { QuestionTrou } from '../questionTrou/QuestionTrou.entity';
import { questionTrouAnswersType } from './types';
import { computeQuestionTrouStatus } from './utils/computeQuestionTrouStatus';

const questionTrouAnswerAdaptator = {
    computeQuestionTrouSummary,
};

function computeQuestionTrouSummary(
    questionTrouAnswers: questionTrouAnswersType,
    questionsTrou: QuestionTrou[],
) {
    // TODO
    const questionTrouSummary: any = {};

    questionsTrou.forEach((questionTrou) => {
        const answer = questionTrouAnswers[questionTrou.id];
        const status = computeQuestionTrouStatus(
            answer,
            questionTrou.rightAnswers,
            questionTrou.acceptableAnswers,
        );
        questionTrouSummary[questionTrou.id] = {
            answer,
            status,
            points: questionTrou.points,
        };
    });
    return questionTrouSummary;
}

export { questionTrouAnswerAdaptator };
