import { acceptableAnswerType, gradeType } from '../../../../types';

type aggregatedAcceptableAnswersType = Record<
    Exclude<gradeType, 'E'>,
    Array<aggregatedAcceptableAnswerType>
>;

type aggregatedAcceptableAnswerType = { answer: string; index: number };

function aggregateAcceptableAnswersByGrade(
    acceptableAnswers: acceptableAnswerType[][],
): aggregatedAcceptableAnswersType {
    const aggregatedAcceptableAnswers: aggregatedAcceptableAnswersType = {
        A: [],
        B: [],
        C: [],
        D: [],
    };
    if (acceptableAnswers.length === 0) {
        return aggregatedAcceptableAnswers;
    }
    for (let i = 0; i < acceptableAnswers[0].length; i++) {
        const acceptableAnswer = acceptableAnswers[0][i];
        if (acceptableAnswer.grade === 'E') {
            continue;
        }
        aggregatedAcceptableAnswers[acceptableAnswer.grade].push({
            answer: acceptableAnswer.answer,
            index: i,
        });
    }

    return aggregatedAcceptableAnswers;
}

export { aggregateAcceptableAnswersByGrade };
export type { aggregatedAcceptableAnswerType };
