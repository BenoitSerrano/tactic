import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { Question } from './Question.entity';
import { buildAttemptService } from '../attempt';
import { Exercise, buildExerciseService } from '../exercise';
import { questionEncoder } from './lib/questionEncoder';
import { addAcceptableAnswerToQuestion } from './lib/addAcceptableAnswerToQuestion';
import { removeOkAnswerFromQuestion } from './lib/removeOkAnswerFromQuestion';
import { acceptableAnswerType, questionDtoType } from './types';
import { addAcceptableAnswerToTexteATrousQuestion } from './lib/addAcceptableAnswerToTexteATrousQuestion';
import { removeOkAnswerFromQuestionFromTexteATrousQuestion } from './lib/removeOkAnswerFromQuestionFromTexteATrousQuestion';
import { Exam } from '../exam';

export { buildQuestionService };

function buildQuestionService() {
    const questionRepository = dataSource.getRepository(Question);
    const questionService = {
        createQuestion,
        updateQuestion,
        addQuestionAcceptableAnswer,
        addQuestionAcceptableAnswerToTexteATrous,
        removeOkAnswer,
        removeOkAnswerFromTexteATrous,
        getQuestions,
        deleteQuestion,
        updateQuestionsOrder,
        decodeQuestion: questionEncoder.decodeQuestion,
        encodeQuestion: questionEncoder.encodeQuestion,
        getQuestionIds,
        getQuestionsByExamId,
        duplicateQuestions,
        duplicateQuestion,
    };

    return questionService;

    async function createQuestion(
        exerciseId: Exercise['id'],
        body: Pick<
            questionDtoType,
            'title' | 'kind' | 'points' | 'possibleAnswers' | 'acceptableAnswers'
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
        const newQuestion = await questionRepository.save(
            questionEncoder.encodeQuestion({
                ...question,
                acceptableAnswers: body.acceptableAnswers,
            }),
        );
        return { id: newQuestion.id };
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
        body: Pick<questionDtoType, 'title' | 'points' | 'possibleAnswers' | 'acceptableAnswers'>,
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
                acceptableAnswers: body.acceptableAnswers,
            }),
        );
    }

    async function addQuestionAcceptableAnswer(
        criteria: {
            questionId: Question['id'];
        },
        body: { acceptableAnswer: acceptableAnswerType },
    ) {
        const question = await questionRepository.findOneOrFail({
            where: { id: criteria.questionId },
        });
        const updatedQuestion = addAcceptableAnswerToQuestion(question, body.acceptableAnswer);
        await questionRepository.save(updatedQuestion);
        return true;
    }

    async function addQuestionAcceptableAnswerToTexteATrous(
        criteria: {
            questionId: Question['id'];
        },
        body: { blankIndex: number; acceptableAnswer: acceptableAnswerType },
    ) {
        const question = await questionRepository.findOneOrFail({
            where: { id: criteria.questionId },
        });
        const updatedQuestion = addAcceptableAnswerToTexteATrousQuestion(question, body);
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

    async function removeOkAnswerFromTexteATrous(
        criteria: {
            questionId: Question['id'];
        },
        body: { okAnswer: string; blankIndex: number },
    ) {
        const question = await questionRepository.findOneOrFail({
            where: { id: criteria.questionId },
        });
        const updatedQuestion = removeOkAnswerFromQuestionFromTexteATrousQuestion(question, body);
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

    async function updateQuestionsOrder(orderedIds: Question['id'][]) {
        for (let i = 0; i < orderedIds.length; i++) {
            const id = orderedIds[i];
            const result = await questionRepository.update({ id }, { order: i });
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

    async function duplicateQuestion(exerciseId: Exercise['id'], questionId: Question['id']) {
        const { id, ...otherFields } = await questionRepository.findOneOrFail({
            where: { id: questionId },
        });
        const newOrder = await getHighestQuestionOrder(exerciseId);
        return questionRepository.insert({
            ...otherFields,
            order: newOrder + 1,
            exercise: { id: exerciseId },
        });
    }

    async function getQuestionsByExamId(examIds: Exam['id'][]) {
        const questions = await questionRepository.find({
            where: { exercise: { exam: { id: In(examIds) } } },
            select: { exercise: { id: true, exam: { id: true } } },
            relations: ['exercise', 'exercise.exam'],
        });
        const questionsByExamId: Record<Exam['id'], questionDtoType[]> = examIds.reduce(
            (acc, examId) => ({ ...acc, [examId]: [] }),
            {},
        );
        for (const question of questions) {
            const questionDto = questionEncoder.decodeQuestion(question);
            questionsByExamId[question.exercise.exam.id] = questionsByExamId[
                question.exercise.exam.id
            ]
                ? [...questionsByExamId[question.exercise.exam.id], questionDto]
                : [questionDto];
        }
        return questionsByExamId;
    }
}
