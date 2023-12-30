import { questionKindType } from '../../../types';
import { attemptAnswersType } from '../types';
import { SPLITTING_CHARACTER_FOR_TAT } from './converter';

function computeExerciseProgress<
    questionT extends { id: number; kind: questionKindType; title: string },
>(questions: questionT[], attemptAnswers: attemptAnswersType): number {
    if (questions.length === 0) {
        return 0;
    }
    const blankLength = questions.reduce((acc, question) => {
        if (question.kind === 'texteATrous') {
            const blankCount = question.title.split(' ').filter((chunk) => chunk === '....').length;
            return acc + blankCount;
        } else {
            return acc + 1;
        }
    }, 0);
    const answeredQuestionsCount = questions.reduce((acc, question) => {
        if (question.kind === 'texteATrous') {
            const answerCount =
                attemptAnswers[question.id] !== undefined
                    ? attemptAnswers[question.id].split(SPLITTING_CHARACTER_FOR_TAT).filter(Boolean)
                          .length
                    : 0;
            return answerCount + acc;
        } else {
            return attemptAnswers[question.id] !== '' && attemptAnswers[question.id] !== undefined
                ? acc + 1
                : acc;
        }
    }, 0);
    return answeredQuestionsCount / blankLength;
}

export { computeExerciseProgress };
