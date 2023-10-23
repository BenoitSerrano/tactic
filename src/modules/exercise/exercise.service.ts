import { Exercise } from './Exercise.entity';
import { dataSource } from '../../dataSource';

export { buildExerciseService };

function buildExerciseService() {
    const exerciseRepository = dataSource.getRepository(Exercise);
    const exerciseService = {
        createExercise,
        getExercise,
        deleteExercise,
        swapExercises,
    };

    return exerciseService;

    async function createExercise(name: string, instruction: string) {
        const exercise = new Exercise();
        exercise.name = name;
        exercise.instruction = instruction;
        return exerciseRepository.save(exercise);
    }

    async function getExercise(exerciseId: Exercise['id']) {
        return exerciseRepository.findOneOrFail({
            where: { id: exerciseId },
            order: { order: 'ASC', questions: { order: 'ASC' } },
            relations: ['questions'],
        });
    }

    async function swapExercises(exerciseId1: Exercise['id'], exerciseId2: Exercise['id']) {
        const exercise1 = await exerciseRepository.findOneOrFail({ where: { id: exerciseId1 } });
        const exercise2 = await exerciseRepository.findOneOrFail({ where: { id: exerciseId2 } });

        await exerciseRepository.update({ id: exerciseId1 }, { order: exercise2.order });
        await exerciseRepository.update({ id: exerciseId2 }, { order: exercise1.order });
        return true;
    }

    async function deleteExercise(exerciseId: Exercise['id']) {
        const exerciseRepository = dataSource.getRepository(Exercise);

        const result = await exerciseRepository.delete({ id: exerciseId });
        return result.affected == 1;
    }
}
