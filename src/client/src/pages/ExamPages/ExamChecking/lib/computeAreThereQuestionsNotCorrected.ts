import { manualMarksType } from '../../lib/extractMarks';
import { exerciseWithAnswersType } from '../../types';

function computeAreThereQuestionsNotCorrected(
    exercises: exerciseWithAnswersType[],
    manualMarks: manualMarksType,
) {
    const answers: Record<number, string | undefined> = {};
    for (const exercise of exercises) {
        for (const question of exercise.questions) {
            answers[question.id] = question.answer;
        }
    }
    return Object.entries(manualMarks).some(
        ([questionId, manualMark]) => manualMark === undefined && !!answers[Number(questionId)],
    );
}

export { computeAreThereQuestionsNotCorrected };
