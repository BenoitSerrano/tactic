import { QuestionTrou } from '../questionTrou/QuestionTrou.entity';
import { QuestionTrouAnswer } from './QuestionTrouAnswer.entity';

const questionTrouAnswerAdaptator = {
    computeQuestionTrouSummary,
};
type questionTrouAnswersType = Record<number, string>;

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
        const status = computeQuestionTrouStatus(questionTrou, trouAnswers);
        questionTrouSummary[questionTrou.id] = {
            answer: trouAnswers[questionTrou.id],
            status,
        };
    });
    return questionTrouSummary;
}

function computeQuestionTrouStatus(
    questionTrou: QuestionTrou,
    questionTrouAnswers: questionTrouAnswersType,
) {
    if (
        questionTrou.rightAnswers.some(
            (rightAnswer) =>
                rightAnswer.trim().toLowerCase() ===
                questionTrouAnswers[questionTrou.id]?.trim().toLowerCase(),
        )
    ) {
        return 'right';
    } else if (
        questionTrou.acceptableAnswers.some(
            (acceptableAnswer) =>
                acceptableAnswer.toLowerCase() ===
                questionTrouAnswers[questionTrou.id]?.trim().toLowerCase(),
        )
    ) {
        return 'acceptable';
    } else {
        return 'wrong';
    }
}

export { questionTrouAnswerAdaptator };
