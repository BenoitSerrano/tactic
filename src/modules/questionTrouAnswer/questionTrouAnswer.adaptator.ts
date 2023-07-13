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

// function computeQuestionTrouStatus(
//     questionTrou: QuestionTrou,
//     questionTrouAnswers: questionTrouAnswersType,
// ) {
//     if (
//         questionTrou.rightAnswers.some(
//             (rightAnswer) =>
//                 rightAnswer.trim().toLowerCase() ===
//                 questionTrouAnswers[questionTrou.id]?.trim().toLowerCase(),
//         )
//     ) {
//         return 'right';
//     } else if (
//         questionTrou.acceptableAnswers.some(
//             (acceptableAnswer) =>
//                 acceptableAnswer.toLowerCase() ===
//                 questionTrouAnswers[questionTrou.id]?.trim().toLowerCase(),
//         )
//     ) {
//         return 'acceptable';
//     } else {
//         return 'wrong';
//     }
// }

export { questionTrouAnswerAdaptator };
