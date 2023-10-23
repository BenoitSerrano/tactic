import { Exercise } from './Exercise.entity';
import { buildExerciseService } from './exercise.service';

export { buildExerciseController };

function buildExerciseController() {
    const exerciseService = buildExerciseService();
    const exerciseController = {
        getExercise,
        deleteExercise,
        swapExercises,
    };

    return exerciseController;

    function getExercise(params: { urlParams: { exerciseId: string } }) {
        return exerciseService.getExercise(Number(params.urlParams.exerciseId));
    }

    async function deleteExercise(params: { urlParams: { exerciseId: string } }) {
        return exerciseService.deleteExercise(Number(params.urlParams.exerciseId));
    }

    async function swapExercises(params: {
        body: { exerciseId1: Exercise['id']; exerciseId2: Exercise['id'] };
    }) {
        return exerciseService.swapExercises(params.body.exerciseId1, params.body.exerciseId2);
    }
}
