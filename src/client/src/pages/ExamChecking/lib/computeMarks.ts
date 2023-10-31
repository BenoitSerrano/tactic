import { exerciseType, questionType } from '../types';

type marksType = Record<number, string>;

function computeMarks(exercises: Array<exerciseType>) {
    const questions: Array<questionType> = [];
    for (const exercise of exercises) {
        questions.push(...exercise.questions);
    }
    return questions.reduce(
        (acc, question) => ({
            ...acc,
            [question.id]: question.mark === undefined ? '' : `${question.mark}`,
        }),
        {} as marksType,
    );
}

export { computeMarks };
export type { marksType };
