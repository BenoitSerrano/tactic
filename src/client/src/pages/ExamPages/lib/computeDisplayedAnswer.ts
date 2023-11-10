import { questionType } from '../types';

function computeDisplayedAnswer(question: questionType) {
    if (question.answer !== undefined && question.answer !== '') {
        if (question.kind === 'qcm' && question.possibleAnswers !== null) {
            return question.possibleAnswers[Number(question.answer)];
        } else {
            return question.answer;
        }
    }
    return '';
}

export { computeDisplayedAnswer };
