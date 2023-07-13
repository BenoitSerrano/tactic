import { QuestionTrou } from '../questionTrou/QuestionTrou.entity';
import { QuestionTrouAnswer } from './QuestionTrouAnswer.entity';
import { computeQuestionTrouStatus } from './utils/computeQuestionTrouStatus';

const questionTrouAnswerAdaptator = {
    computeQuestionTrouSummary,
};

function computeQuestionTrouSummary(
    questionTrouAnswers: QuestionTrouAnswer[],
    questionsTrou: QuestionTrou[],
) {
    const trouAnswers: Record<number, string> = {};

    questionTrouAnswers.forEach((questionTrouAnswer) => {
        const id = questionTrouAnswer.questionTrou.id;
        trouAnswers[id] = questionTrouAnswer.answer;
    });
    const questionTrouSummary: any = {};

    questionsTrou.forEach((questionTrou) => {
        const answer = trouAnswers[questionTrou.id];
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
