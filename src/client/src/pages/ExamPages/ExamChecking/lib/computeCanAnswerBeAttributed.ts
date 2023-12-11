import { questionWithAnswersType } from '../../types';

function computeCanAnswerBeAttributed(
    newPoints: number,
    currentPoints: number,
    question: questionWithAnswersType,
) {
    if (newPoints === question.points) {
        return currentPoints !== newPoints && !!question.answer;
    } else if (newPoints === 0) {
        return (
            currentPoints !== 0 &&
            (currentPoints !== question.points ||
                question.acceptableAnswersWithPoints.filter(
                    ({ points }) => points === question.points,
                ).length > 1)
        );
    } else {
        return (
            currentPoints !== newPoints &&
            !!question.answer &&
            (currentPoints !== question.points ||
                question.acceptableAnswersWithPoints.filter(
                    ({ points }) => points === question.points,
                ).length > 1)
        );
    }
}

export { computeCanAnswerBeAttributed };
