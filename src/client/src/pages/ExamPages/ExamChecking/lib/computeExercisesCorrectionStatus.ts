import { exerciseWithAnswersType } from '../../types';

type exercisesCorrectionStatusType = {
    isCorrectionDone: boolean;
    statuses: Record<number, 'corrected' | 'notCorrected'>;
};

function computeExercisesCorrectionStatus(
    exercises: exerciseWithAnswersType[],
): exercisesCorrectionStatusType {
    let exercisesCorrectionStatuses: exercisesCorrectionStatusType['statuses'] = {};
    let isCorrectionDone = true;
    for (const exercise of exercises) {
        exercisesCorrectionStatuses = {
            ...exercisesCorrectionStatuses,
            [exercise.id]: 'corrected',
        };
        for (const question of exercise.questions) {
            if (question.kind === 'texteLibre') {
                if (question.mark === undefined && !!question.answer) {
                    exercisesCorrectionStatuses = {
                        ...exercisesCorrectionStatuses,
                        [exercise.id]: 'notCorrected',
                    };
                    isCorrectionDone = false;
                    continue;
                }
            }
        }
    }
    return { isCorrectionDone, statuses: exercisesCorrectionStatuses };
}

export { computeExercisesCorrectionStatus };
