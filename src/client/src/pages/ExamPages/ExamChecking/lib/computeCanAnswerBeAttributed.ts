import { acceptableAnswerParser } from '../../../../lib/acceptableAnswerParser';
import { questionWithAnswersType } from '../../types';

function computeCanAnswerBeAttributed(
    newPoints: number,
    currentPoints: number,
    question: questionWithAnswersType,
) {
    const parsedAcceptableAnswersWithPoints = question.acceptableAnswersWithPoints.map(
        (acceptableAnswer) => acceptableAnswerParser.parse(acceptableAnswer),
    );
    if (newPoints === question.points) {
        return currentPoints !== newPoints && !!question.answer;
    } else if (newPoints === 0) {
        return (
            currentPoints !== 0 &&
            (currentPoints !== question.points ||
                parsedAcceptableAnswersWithPoints.filter(({ points }) => points === question.points)
                    .length > 1)
        );
    } else {
        return (
            currentPoints !== newPoints &&
            !!question.answer &&
            (currentPoints !== question.points ||
                parsedAcceptableAnswersWithPoints.filter(({ points }) => points === question.points)
                    .length > 1)
        );
    }
}

export { computeCanAnswerBeAttributed };
