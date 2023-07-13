import { dataSource } from '../../dataSource';
import { buildExamService } from '../exam/exam.service';
import { QuestionChoixMultiple } from '../questionChoixMultiple';

export { buildQuestionChoixMultipleService };

function buildQuestionChoixMultipleService() {
    const questionChoixMultipleRepository = dataSource.getRepository(QuestionChoixMultiple);
    const questionChoixMultipleService = {
        createQuestionChoixMultiple,
        updateQuestionChoixMultiple,
    };

    return questionChoixMultipleService;

    async function createQuestionChoixMultiple(
        examId: string,
        body: {
            title: string;
            possibleAnswers: string[];
            rightAnswerIndex: number;
        },
    ) {
        const examService = buildExamService();
        const exam = await examService.getExam(examId);

        const questionChoixMultiple = new QuestionChoixMultiple();
        const highestOrder = await getHighestQuestionChoixMultipleOrder(examId);

        questionChoixMultiple.possibleAnswers = body.possibleAnswers;
        questionChoixMultiple.rightAnswerIndex = body.rightAnswerIndex;
        questionChoixMultiple.title = body.title;
        questionChoixMultiple.exam = exam;
        questionChoixMultiple.order = highestOrder + 1;
        return questionChoixMultipleRepository.save(questionChoixMultiple);
    }

    async function getHighestQuestionChoixMultipleOrder(examId: string) {
        const questionsChoixMultiple = await questionChoixMultipleRepository.find({
            where: { exam: { id: examId } },
            select: { order: true, id: true },
            order: { order: 'DESC' },
            take: 1,
        });

        if (questionsChoixMultiple.length == 0) {
            return -1;
        }
        return questionsChoixMultiple[0].order;
    }

    async function updateQuestionChoixMultiple({
        examId,
        qcmId,
        title,
        possibleAnswers,
        rightAnswerIndex,
    }: {
        examId: string;
        qcmId: number;
        title: string;
        possibleAnswers: string[];
        rightAnswerIndex: number;
    }) {
        const questionChoixMultiple = await questionChoixMultipleRepository.findOneOrFail({
            where: { exam: { id: examId }, id: qcmId },
        });
        questionChoixMultiple.title = title;
        questionChoixMultiple.possibleAnswers = possibleAnswers;
        questionChoixMultiple.rightAnswerIndex = rightAnswerIndex;

        return questionChoixMultipleRepository.save(questionChoixMultiple);
    }
}
