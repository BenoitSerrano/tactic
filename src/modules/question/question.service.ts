import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { Question } from './Question.entity';
import { buildAttemptService } from '../attempt';
import { Exercise, buildExerciseService } from '../exercise';
import { questionEncoder } from './lib/questionEncoder';
import { addAcceptableAnswerToQuestion } from './lib/addAcceptableAnswerToQuestion';
import { removeOkAnswerFromQuestion } from './lib/removeOkAnswerFromQuestion';
import { acceptableAnswerWithPointsType, questionDtoType } from './types';

export { buildQuestionService };

function buildQuestionService() {
    const questionRepository = dataSource.getRepository(Question);
    const questionService = {
        createQuestion,
        updateQuestion,
        addQuestionAcceptableAnswer,
        removeOkAnswer,
        getQuestions,
        deleteQuestion,
        updateQuestionsOrder,
        decodeQuestion: questionEncoder.decodeQuestion,
        encodeQuestion: questionEncoder.encodeQuestion,
        getQuestionIds,
        duplicateQuestions,
    };

    return questionService;

    async function createQuestion(
        exerciseId: Exercise['id'],
        body: Pick<
            questionDtoType,
            'title' | 'kind' | 'points' | 'possibleAnswers' | 'acceptableAnswersWithPoints'
        >,
    ) {
        const exerciseService = buildExerciseService();
        const exercise = await exerciseService.getExerciseWithoutQuestions(exerciseId);

        const question = new Question();

        const highestOrder = await getHighestQuestionOrder(exerciseId);

        question.possibleAnswers = body.possibleAnswers;
        question.title = body.title;
        question.kind = body.kind;
        question.points = body.points;
        question.exercise = exercise;
        question.order = highestOrder + 1;
        return questionRepository.save(
            questionEncoder.encodeQuestion({
                ...question,
                acceptableAnswersWithPoints: body.acceptableAnswersWithPoints,
            }),
        );
    }

    async function getHighestQuestionOrder(exerciseId: Exercise['id']) {
        const questions = await questionRepository.find({
            where: { exercise: { id: exerciseId } },
            select: { order: true, id: true },
            order: { order: 'DESC' },
            take: 1,
        });

        if (questions.length == 0) {
            return -1;
        }
        return questions[0].order;
    }

    async function updateQuestion(
        criteria: { exerciseId: Exercise['id']; questionId: Question['id'] },
        body: Pick<
            questionDtoType,
            'title' | 'points' | 'possibleAnswers' | 'acceptableAnswersWithPoints'
        >,
    ) {
        const question = await questionRepository.findOneOrFail({
            where: { id: criteria.questionId, exercise: { id: criteria.exerciseId } },
        });

        question.title = body.title;
        question.possibleAnswers = body.possibleAnswers;
        question.points = body.points;

        return questionRepository.save(
            questionEncoder.encodeQuestion({
                ...question,
                acceptableAnswersWithPoints: body.acceptableAnswersWithPoints,
            }),
        );
    }

    async function addQuestionAcceptableAnswer(
        criteria: {
            questionId: Question['id'];
        },
        body: { acceptableAnswerWithPoints: acceptableAnswerWithPointsType },
    ) {
        const question = await questionRepository.findOneOrFail({
            where: { id: criteria.questionId },
        });
        const updatedQuestion = addAcceptableAnswerToQuestion(
            question,
            body.acceptableAnswerWithPoints,
        );
        await questionRepository.save(updatedQuestion);
        return true;
    }

    async function removeOkAnswer(
        criteria: {
            questionId: Question['id'];
        },
        okAnswer: string,
    ) {
        const question = await questionRepository.findOneOrFail({
            where: { id: criteria.questionId },
        });
        const updatedQuestion = removeOkAnswerFromQuestion(question, okAnswer);
        await questionRepository.save(updatedQuestion);
        return true;
    }

    async function getQuestions(questionIds: Question['id'][]) {
        const questions = await questionRepository.find({
            where: { id: In(questionIds) },
        });
        return questions.reduce((acc, question) => {
            return { ...acc, [question.id]: questionEncoder.decodeQuestion(question) };
        }, {} as Record<Question['id'], questionDtoType>);
    }

    async function updateQuestionsOrder(orders: Array<{ id: Question['id']; order: number }>) {
        for (const { id, order } of orders) {
            const result = await questionRepository.update({ id }, { order });
            if (result.affected !== 1) {
                console.error(`Could not update question id ${id} order because it does not exist`);
            }
        }
        return true;
    }

    async function deleteQuestion(questionId: Question['id']) {
        const attemptService = buildAttemptService();
        await attemptService.deleteQuestionAnswers(questionId);
        return questionRepository.delete({ id: questionId });
    }

    async function getQuestionIds(exerciseId: Exercise['id']) {
        const questions = await questionRepository.find({
            where: { exercise: { id: exerciseId } },
            relations: ['exercise'],
            select: { id: true, exercise: { id: true } },
        });
        return questions.map(({ id }) => id);
    }

    async function duplicateQuestions(newExercise: Exercise, questions: Question[]) {
        const newQuestions = questions.map((question) => ({
            ...question,
            exercise: newExercise,
        }));
        return questionRepository.insert(newQuestions);
    }
}
