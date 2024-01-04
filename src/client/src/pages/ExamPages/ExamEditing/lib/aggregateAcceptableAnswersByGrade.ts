import { acceptableAnswerType, gradeType } from '../../../../types';

type aggregatedAcceptableAnswersType = Record<Exclude<gradeType, 'E'>, string[]>;

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
    for (const acceptableAnswer of acceptableAnswers[0]) {
        if (acceptableAnswer.grade === 'E') {
            continue;
        }
        aggregatedAcceptableAnswers[acceptableAnswer.grade].push(acceptableAnswer.answer);
    }

    return aggregatedAcceptableAnswers;
}

export { aggregateAcceptableAnswersByGrade };
