import { exerciseWithAnswersType } from '../../types';

function computeAreThereQuestionsNotCorrected(exercises: exerciseWithAnswersType[]) {
    for (const exercise of exercises) {
        for (const question of exercise.questions) {
            if (question.kind === 'texteLibre') {
                if (question.grade === undefined && !!question.answer) {
                    return true;
                }
            }
        }
    }
    return false;
}

export { computeAreThereQuestionsNotCorrected };
