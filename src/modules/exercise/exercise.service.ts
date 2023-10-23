import { Exercise } from './Exercise.entity';
import { dataSource } from '../../dataSource';
import { Exam, buildExamService } from '../exam';

export { buildExerciseService };

function buildExerciseService() {
    const exerciseRepository = dataSource.getRepository(Exercise);
    const exerciseService = {
        createExercise,
        updateExercise,
        getExercise,
        deleteExercise,
        swapExercises,
    };

    return exerciseService;

    async function createExercise(examId: Exam['id'], body: { name: string; instruction: string }) {
        const examService = buildExamService();
        const exam = await examService.getExam(examId);
        const order = await getHighestExerciseOrder(examId);

        const exercise = new Exercise();
        exercise.name = body.name;
        exercise.instruction = body.instruction;
        exercise.exam = exam;
        exercise.order = order;

        return exerciseRepository.save(exercise);
    }

    async function getHighestExerciseOrder(examId: Exam['id']) {
        const exercises = await exerciseRepository.find({
            where: { exam: { id: examId } },
            select: { order: true, id: true },
            order: { order: 'DESC' },
            take: 1,
        });

        if (exercises.length == 0) {
            return -1;
        }
        return exercises[0].order;
    }

    async function updateExercise(
        criteria: { examId: Exam['id']; exerciseId: Exercise['id'] },
        body: { name: string; instruction: string },
    ) {
        return exerciseRepository.update(
            { exam: { id: criteria.examId }, id: criteria.exerciseId },
            { name: body.name, instruction: body.instruction },
        );
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
