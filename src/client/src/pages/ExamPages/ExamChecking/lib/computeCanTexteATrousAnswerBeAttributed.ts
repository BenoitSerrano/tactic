import { gradeType } from '../../../../types';
import { questionWithAnswersType } from '../../types';

function computeCanTexteATrousAnswerBeAttributed(
    gradeToAttribute: gradeType,
    currentBlankGrade: gradeType | undefined,
    blankIndex: number,
    question: questionWithAnswersType,
) {
    if (question.kind !== 'texteATrous') {
        return false;
    }
    if (!question.answer) {
        return false;
    }

    if (gradeToAttribute === currentBlankGrade) {
        return false;
    }

    if (currentBlankGrade === 'A') {
        const isThereMoreThanOneRightAnswer =
            question.acceptableAnswers[blankIndex].filter(({ grade }) => grade === 'A').length > 1;

        if (!isThereMoreThanOneRightAnswer) {
            return false;
        }
    }

    return true;
}

export { computeCanTexteATrousAnswerBeAttributed };
