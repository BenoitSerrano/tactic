import { dataSource } from '../../dataSource';
import { buildExamService } from '../exam/exam.service';
import { QuestionTrou } from '.';

export { buildQuestionTrouService };

function buildQuestionTrouService() {
    const questionTrouRepository = dataSource.getRepository(QuestionTrou);
    const questionTrouService = {
        createQuestionTrou,
        updateQuestionTrou,
    };

    return questionTrouService;

    async function createQuestionTrou(examId: string) {
        const examService = buildExamService();
        const exam = await examService.getExam(examId);

        const questionTrou = new QuestionTrou();
        const highestOrder = await getHighestQuestionTrouOrder(examId);

        questionTrou.acceptableAnswers = [''];
        questionTrou.rightAnswers = [''];
        questionTrou.beforeText = '';
        questionTrou.afterText = '';
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
    }: {
        examId: string;
        questionTrouId: number;
        beforeText: string;
        afterText: string;
        rightAnswers: string[];
        acceptableAnswers: string[];
    }) {
        const questionTrou = await questionTrouRepository.findOneOrFail({
            where: { exam: { id: examId }, id: questionTrouId },
        });
        if (beforeText !== undefined) {
            questionTrou.beforeText = beforeText;
        }
        if (afterText !== undefined) {
            questionTrou.afterText = afterText;
        }
        if (rightAnswers !== undefined) {
            questionTrou.rightAnswers = rightAnswers;
        }
        if (acceptableAnswers !== undefined) {
            questionTrou.acceptableAnswers = acceptableAnswers;
        }

        return questionTrouRepository.save(questionTrou);
    }
}
