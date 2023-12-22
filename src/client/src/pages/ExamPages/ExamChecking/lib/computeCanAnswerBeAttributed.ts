import { manualQuestionKinds } from '../../../../constants';
import { questionWithAnswersType } from '../../types';

function computeCanAnswerBeAttributed(newMark: number, question: questionWithAnswersType) {
    if (!question.answer) {
        return false;
    }

    const isQuestionManuallyCorrected = manualQuestionKinds.includes(question.kind);
    if (isQuestionManuallyCorrected) {
        return newMark !== question.mark;
    }

    if (!question.answer) {
        return false;
    }
    if (question.mark === newMark) {
        return false;
    }

    if (newMark !== question.points && question.mark === question.points) {
        const isThereMoreThanOneRightAnswer =
            question.acceptableAnswers.filter(({ points }) => points === question.points).length >
            1;

        if (!isThereMoreThanOneRightAnswer) {
            return false;
        }
    }

    return true;
}

export { computeCanAnswerBeAttributed };
