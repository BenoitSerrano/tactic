import { gradeConverter } from '../../../../lib/gradeConverter';
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
        const convertedGrade = gradeConverter.convertMarkToGrade(question.mark, question.points);
        return newGrade !== convertedGrade;
    }

    if (!question.answer) {
        return false;
    }
    if (question.grade === newGrade) {
        return false;
    }

    if (question.grade === 'A') {
        const isThereMoreThanOneRightAnswer =
            question.acceptableAnswers[0].filter(({ grade }) => grade === 'A').length > 1;

        if (!isThereMoreThanOneRightAnswer) {
            return false;
        }
    }

    return true;
}

export { computeCanAnswerBeAttributed };
