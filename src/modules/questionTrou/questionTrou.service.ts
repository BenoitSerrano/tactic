import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { buildExamService } from '../exam/exam.service';
import { QuestionTrou } from './QuestionTrou.entity';
import { mapEntities } from '../../lib/mapEntities';

export { buildQuestionTrouService };

function buildQuestionTrouService() {
    const questionTrouRepository = dataSource.getRepository(QuestionTrou);
    const questionTrouService = {
        createQuestionTrou,
        updateQuestionTrou,
        getQuestionsTrou,
        getAllQuestionsTrou,
        bulkInsertQuestionsTrou,
    };

    return questionTrouService;

    async function createQuestionTrou(
        examId: string,
        body: {
            beforeText: string;
            afterText: string;
            rightAnswers: string[];
            acceptableAnswers: string[];
            points: number;
        },
    ) {
        const examService = buildExamService();
        const exam = await examService.getExam(examId);

        const questionTrou = new QuestionTrou();
        const highestOrder = await getHighestQuestionTrouOrder(examId);

        questionTrou.acceptableAnswers = body.acceptableAnswers;
        questionTrou.rightAnswers = body.rightAnswers;
        questionTrou.beforeText = body.beforeText;
        questionTrou.afterText = body.afterText;
        questionTrou.points = body.points;
        questionTrou.exam = exam;
        questionTrou.order = highestOrder + 1;
        return questionTrouRepository.save(questionTrou);
    }

    async function getHighestQuestionTrouOrder(examId: string) {
        const questionsTrou = await questionTrouRepository.find({
            where: { exam: { id: examId } },
            select: { order: true, id: true },
            order: { order: 'DESC' },
            take: 1,
        });

        if (questionsTrou.length == 0) {
            return -1;
        }
        return questionsTrou[0].order;
    }

    async function updateQuestionTrou({
        examId,
        questionTrouId,
        beforeText,
        afterText,
        rightAnswers,
        acceptableAnswers,
        points,
    }: {
        examId: string;
        questionTrouId: number;
        beforeText: string;
        afterText: string;
        rightAnswers: string[];
        acceptableAnswers: string[];
        points: number;
    }) {
        const questionTrou = await questionTrouRepository.findOneOrFail({
            where: { exam: { id: examId }, id: questionTrouId },
        });
        questionTrou.beforeText = beforeText;
        questionTrou.afterText = afterText;
        questionTrou.rightAnswers = rightAnswers;
        questionTrou.acceptableAnswers = acceptableAnswers;
        questionTrou.points = points;

        return questionTrouRepository.save(questionTrou);
    }

    async function getQuestionsTrou(questionTrouIds: number[]) {
        const questionsTrou = await questionTrouRepository.find({
            where: { id: In(questionTrouIds) },
        });
        return questionsTrou.reduce((acc, questionTrou) => {
            return { ...acc, [questionTrou.id]: questionTrou };
        }, {} as Record<number, QuestionTrou>);
    }

    async function getAllQuestionsTrou() {
        const questionsTrou = await questionTrouRepository.find({
            relations: ['exam'],
            select: { exam: { id: true } },
        });
        return mapEntities(questionsTrou);
    }

    async function bulkInsertQuestionsTrou(questionsTrou: Array<QuestionTrou>) {
        return questionTrouRepository.insert(questionsTrou);
    }
}
