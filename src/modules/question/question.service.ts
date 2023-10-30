import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { Question } from './Question.entity';
import { buildAttemptService } from '../attempt';
import { Exercise, buildExerciseService } from '../exercise';
import { questionEncoder } from './lib/questionEncoder';
import { addRightAnswerToQuestion } from './lib/addRightAnswerToQuestion';
import { addAcceptableAnswerToQuestion } from './lib/addAcceptableAnswerToQuestion';
import { removeOkAnswerFromQuestion } from './lib/removeOkAnswerFromQuestion';

export { buildQuestionService };

function buildQuestionService() {
    const questionRepository = dataSource.getRepository(Question);
    const questionService = {
        createQuestion,
        updateQuestion,
        addQuestionRightAnswer,
        addQuestionAcceptableAnswer,
        removeOkAnswer,
        getQuestions,
        deleteQuestion,
        swapQuestions,
        decodeQuestion: questionEncoder.decodeQuestion,
        encodeQuestion: questionEncoder.encodeQuestion,
        getQuestionIds,
    };

    return questionService;

    async function createQuestion(
        exerciseId: Exercise['id'],
        body: Pick<
            Question,
            'title' | 'kind' | 'points' | 'possibleAnswers' | 'rightAnswers' | 'acceptableAnswers'
        >,
    ) {
        const exerciseService = buildExerciseService();
        const exercise = await exerciseService.getExercise(exerciseId);

        const question = new Question();
        const highestOrder = await getHighestQuestionOrder(exerciseId);

        question.acceptableAnswers = body.acceptableAnswers;
        question.rightAnswers = body.rightAnswers;
        question.possibleAnswers = body.possibleAnswers;
        question.title = body.title;
        question.kind = body.kind;
        question.points = body.points;
        question.exercise = exercise;
        question.order = highestOrder + 1;
        return questionRepository.save(questionEncoder.encodeQuestion(question));
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
            Question,
            'title' | 'points' | 'possibleAnswers' | 'rightAnswers' | 'acceptableAnswers'
        >,
    ) {
        const question = await questionRepository.findOneOrFail({
            where: { id: criteria.questionId, exercise: { id: criteria.exerciseId } },
        });

        question.title = body.title;
        question.possibleAnswers = body.possibleAnswers;
        question.rightAnswers = body.rightAnswers;
        question.acceptableAnswers = body.acceptableAnswers;
        question.points = body.points;

        return questionRepository.save(questionEncoder.encodeQuestion(question));
    }

    async function addQuestionRightAnswer(
        criteria: {
            questionId: Question['id'];
        },
        rightAnswer: string,
    ) {
        const question = await questionRepository.findOneOrFail({
            where: { id: criteria.questionId },
        });
        const updatedQuestion = addRightAnswerToQuestion(question, rightAnswer);
        await questionRepository.save(updatedQuestion);
        return true;
    }

    async function addQuestionAcceptableAnswer(
        criteria: {
            questionId: Question['id'];
        },
        acceptableAnswer: string,
    ) {
        const question = await questionRepository.findOneOrFail({
            where: { id: criteria.questionId },
        });
        const updatedQuestion = addAcceptableAnswerToQuestion(question, acceptableAnswer);
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
        }, {} as Record<Question['id'], Question>);
    }

    async function swapQuestions(questionId1: Question['id'], questionId2: Question['id']) {
        const question1 = await questionRepository.findOneOrFail({ where: { id: questionId1 } });
        const question2 = await questionRepository.findOneOrFail({ where: { id: questionId2 } });

        await questionRepository.update({ id: questionId1 }, { order: question2.order });
        await questionRepository.update({ id: questionId2 }, { order: question1.order });
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
}
