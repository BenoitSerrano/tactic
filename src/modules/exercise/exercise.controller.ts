import { Question } from '../question';
import { questionKindType } from '../question/types';
import { Exercise } from './Exercise.entity';
import { buildExerciseService } from './exercise.service';

export { buildExerciseController };

function buildExerciseController() {
    const exerciseService = buildExerciseService();
    const exerciseController = {
        getExercise,
        deleteExercise,
        updateExercisesOrder,
        createExercise,
        updateExercise,
    };

    return exerciseController;

    function getExercise(params: { urlParams: { exerciseId: string } }) {
        return exerciseService.getExercise(Number(params.urlParams.exerciseId));
    }

    function createExercise(params: {
        urlParams: { examId: string };
        body: {
            name: string;
            instruction: string;
            defaultPoints: number;
            defaultQuestionKind: Question['kind'];
        };
    }) {
        return exerciseService.createExercise(params.urlParams.examId, params.body);
    }

    function updateExercise(params: {
        urlParams: { examId: string; exerciseId: string };
        body: {
            name: string;
            instruction: string;
            defaultPoints: number;
            defaultQuestionKind: questionKindType;
        };
    }) {
        return exerciseService.updateExercise(
            {
                examId: params.urlParams.examId,
                exerciseId: Number(params.urlParams.exerciseId),
            },
            params.body,
        );
    }

    async function deleteExercise(params: { urlParams: { exerciseId: string } }) {
        return exerciseService.deleteExercise(Number(params.urlParams.exerciseId));
    }

    async function updateExercisesOrder(params: { body: { orderedIds: Exercise['id'][] } }) {
        return exerciseService.updateExercisesOrder(params.body.orderedIds);
    }
}
