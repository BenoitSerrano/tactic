import { Exercise } from './Exercise.entity';
import { dataSource } from '../../dataSource';
import { Exam, buildExamService } from '../exam';
import { Question, buildQuestionService } from '../question';
import { buildAttemptService } from '../attempt';
import { questionKindType } from '../question/types';
import { logger } from '../../lib/logger';

export { buildExerciseService };

function buildExerciseService() {
    const exerciseRepository = dataSource.getRepository(Exercise);
    const questionService = buildQuestionService();
    const exerciseService = {
        createExercise,
        updateExercise,
        getExerciseWithoutQuestions,
        deleteExercise,
        updateExercisesOrder,
        getExamId,
        duplicateExercises,
        duplicateExercise,
    };

    return exerciseService;

    async function createExercise(
        examId: Exam['id'],
        body: {
            name: string;
            instruction: string;
            defaultPoints: number | null;
            defaultQuestionKind: Question['kind'];
        },
    ) {
        const examService = buildExamService();
        const exam = await examService.getExam(examId);
        const highestOrder = await getHighestExerciseOrder(examId);

        const exercise = new Exercise();
        exercise.name = body.name;
        exercise.instruction = body.instruction;
        exercise.defaultPoints = body.defaultPoints;
        exercise.defaultQuestionKind = body.defaultQuestionKind;
        exercise.order = highestOrder + 1;
        exercise.exam = exam;

        const newExercise = await exerciseRepository.save(exercise);
        return { id: newExercise.id };
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
        body: {
            name: string;
            instruction: string;
            defaultPoints: number | null;
            defaultQuestionKind: questionKindType;
        },
    ) {
        if (body.defaultPoints !== null) {
            await questionService.updateQuestionsPointsByExerciseId(
                criteria.examId,
                criteria.exerciseId,
                body.defaultPoints,
            );
        }
        return exerciseRepository.update(
            { exam: { id: criteria.examId }, id: criteria.exerciseId },
            {
                name: body.name,
                instruction: body.instruction,
                defaultPoints: body.defaultPoints,
                defaultQuestionKind: body.defaultQuestionKind,
            },
        );
    }

    async function getExamId(exerciseId: Exercise['id']) {
        const exercise = await exerciseRepository.findOneOrFail({
            where: { id: exerciseId },
            select: { id: true, exam: { id: true } },
            relations: ['exam'],
        });
        return exercise.exam.id;
    }

    async function getExerciseWithoutQuestions(exerciseId: Exercise['id']) {
        const exercise = await exerciseRepository.findOneOrFail({
            where: { id: exerciseId },
            order: { order: 'ASC' },
        });

        return exercise;
    }

    async function updateExercisesOrder(orderedIds: Exercise['id'][]) {
        for (let i = 0; i < orderedIds.length; i++) {
            const id = orderedIds[i];
            const result = await exerciseRepository.update({ id }, { order: i });
            if (result.affected !== 1) {
                logger.error(`Could not update exercise id ${id} order because it does not exist`);
            }
        }

        return true;
    }

    async function deleteExercise(exerciseId: Exercise['id']) {
        const attemptService = buildAttemptService();
        await attemptService.deleteExerciseAnswers(exerciseId);

        const result = await exerciseRepository.delete({ id: exerciseId });
        if (result.affected !== 1) {
            throw new Error(`The affected row length (${result.affected}) !== 1 `);
        }
        return { id: exerciseId };
    }

    async function duplicateExercises(newExam: Exam, exercises: Exercise[]) {
        const questionService = buildQuestionService();
        const newExercises = exercises.map((exercise) => ({
            ...exercise,
            exam: newExam,
        }));
        for (const newExercise of newExercises) {
            const result = await exerciseRepository.insert(newExercise);
            const newExerciseId = result.identifiers[0].id;
            await questionService.duplicateQuestions(newExerciseId, newExercise.questions);
        }
    }

    async function duplicateExercise(newExamId: Exam['id'], exerciseId: Exercise['id']) {
        const questionService = buildQuestionService();
        const exercise = await exerciseRepository.findOneOrFail({
            where: { id: exerciseId },
            relations: ['questions'],
        });
        const newOrder = (await getLastExerciseOrder(newExamId)) + 1;

        const newExercise = {
            ...exercise,
            order: newOrder,
            exam: { id: newExamId },
        };
        const result = await exerciseRepository.insert(newExercise);
        const newExerciseId = result.identifiers[0].id;
        await questionService.duplicateQuestions(newExerciseId, newExercise.questions);
        return { id: newExerciseId, name: exercise.name };
    }

    async function getLastExerciseOrder(examId: Exam['id']) {
        const lastExercise = await exerciseRepository.findOne({
            where: { exam: { id: examId } },
            order: { order: 'DESC' },
            select: { id: true, order: true, exam: { id: true } },
        });
        if (lastExercise) {
            return lastExercise.order;
        } else {
            return 0;
        }
    }
}
