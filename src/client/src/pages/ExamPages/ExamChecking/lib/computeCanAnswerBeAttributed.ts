import { gradeType } from '../../../../types';
import { amendableQuestionWithAnswersType } from '../../types';

function computeCanAnswerBeAttributed(
    newGrade: gradeType,
    question: amendableQuestionWithAnswersType,
) {
    if (!question.answer) {
        return false;
    }

    if (question.kind === 'texteLibre') {
        return newGrade !== question.grade;
    }

    if (!question.answer) {
        return false;
    }
    if (question.grade === newGrade) {
        return false;
    }

    if (question.grade === 'A') {
        const isThereMoreThanOneRightAnswer =
            question.acceptableAnswers.filter(({ grade }) => grade === 'A').length > 1;

        if (!isThereMoreThanOneRightAnswer) {
            return false;
        }
    }

    return true;
}

export { computeCanAnswerBeAttributed };
