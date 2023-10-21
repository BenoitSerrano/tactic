import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { Question } from './Question.entity';
import { buildExamService } from '../exam';
import { buildAttemptService } from '../attempt';

export { buildQuestionService };

function buildQuestionService() {
    const questionRepository = dataSource.getRepository(Question);
    const questionService = {
        createQuestion,
        updateQuestion,
        getQuestions,
        deleteQuestion,
        swapQuestions,
    };

    return questionService;

    async function createQuestion(
        examId: string,
        body: {
            title: string;
            possibleAnswers: string[] | undefined;
            kind: Question['kind'];
            rightAnswers: string[];
            acceptableAnswers: string[];
            points: number;
        },
    ) {
        const examService = buildExamService();
        const exam = await examService.getExam(examId);

        const question = new Question();
        const highestOrder = await getHighestQuestionOrder(examId);

        question.acceptableAnswers = body.acceptableAnswers;
        question.rightAnswers = body.rightAnswers;
        question.possibleAnswers = body.possibleAnswers;
        question.title = body.title;
        question.kind = body.kind;
        question.points = body.points;
        question.exam = exam;
        question.order = highestOrder + 1;
        return questionRepository.save(question);
    }

    async function getHighestQuestionOrder(examId: string) {
        const questions = await questionRepository.find({
            where: { exam: { id: examId } },
            select: { order: true, id: true },
            order: { order: 'DESC' },
            take: 1,
        });

        if (questions.length == 0) {
            return -1;
        }
        return questions[0].order;
    }

    async function updateQuestion({
        examId,
        questionId,
        title,
        possibleAnswers,
        rightAnswers,
        acceptableAnswers,
        points,
    }: {
        examId: string;
        questionId: number;
        title: string;
        possibleAnswers: string[] | undefined;
        rightAnswers: string[];
        acceptableAnswers: string[];
        points: number;
    }) {
        const question = await questionRepository.findOneOrFail({
            where: { exam: { id: examId }, id: questionId },
        });
        question.title = title;
        question.possibleAnswers = possibleAnswers;
        question.rightAnswers = rightAnswers;
        question.acceptableAnswers = acceptableAnswers;
        question.points = points;

        return questionRepository.save(question);
    }

    async function getQuestions(questionIds: Question['id'][]) {
        const questions = await questionRepository.find({
            where: { id: In(questionIds) },
        });
        return questions.reduce((acc, question) => {
            return { ...acc, [question.id]: question };
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
}