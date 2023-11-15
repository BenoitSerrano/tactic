import { manualQuestionKinds } from '../../../constants';
import { exerciseWithAnswersType, questionWithAnswersType } from '../types';

type marksType = { manual: manualMarksType; automatic: Record<number, number> };
type manualMarksType = Record<number, number | undefined>;
function extractMarks(exercises: Array<exerciseWithAnswersType>) {
    const questions: Array<questionWithAnswersType> = [];
    for (const exercise of exercises) {
        questions.push(...exercise.questions);
    }
    return questions.reduce(
        (acc, question) => {
            if (manualQuestionKinds.includes(question.kind)) {
                return {
                    ...acc,
                    manual: {
                        ...acc.manual,
                        [question.id]: question.mark,
                    },
                };
            } else {
                return {
                    ...acc,
                    automatic: {
                        ...acc.automatic,
                        [question.id]: question.mark || 0,
                    },
                };
            }
        },
        { manual: {}, automatic: {} } as marksType,
    );
}

export { extractMarks };
export type { marksType, manualMarksType };
