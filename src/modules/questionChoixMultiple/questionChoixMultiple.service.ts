import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { buildExamService } from '../exam/exam.service';
import { QuestionChoixMultiple } from '../questionChoixMultiple';
import { mapEntities } from '../../lib/mapEntities';

export { buildQuestionChoixMultipleService };

function buildQuestionChoixMultipleService() {
    const questionChoixMultipleRepository = dataSource.getRepository(QuestionChoixMultiple);
    const questionChoixMultipleService = {
        createQuestionChoixMultiple,
        updateQuestionChoixMultiple,
        getQuestionsChoixMultiples,
        getAllQuestionsChoixMultiples,
        bulkInsertQcm,
    };

    return questionChoixMultipleService;

    async function createQuestionChoixMultiple(
        examId: string,
        body: {
            title: string;
            possibleAnswers: string[];
            rightAnswerIndex: number;
            points: number;
        },
    ) {
        const examService = buildExamService();
        const exam = await examService.getExam(examId);

        const questionChoixMultiple = new QuestionChoixMultiple();
        const highestOrder = await getHighestQuestionChoixMultipleOrder(examId);

        questionChoixMultiple.possibleAnswers = body.possibleAnswers;
        questionChoixMultiple.rightAnswerIndex = body.rightAnswerIndex;
        questionChoixMultiple.title = body.title;
        questionChoixMultiple.points = body.points;
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
        points,
    }: {
        examId: string;
        qcmId: number;
        title: string;
        possibleAnswers: string[];
        rightAnswerIndex: number;
        points: number;
    }) {
        const questionChoixMultiple = await questionChoixMultipleRepository.findOneOrFail({
            where: { exam: { id: examId }, id: qcmId },
        });
        questionChoixMultiple.title = title;
        questionChoixMultiple.possibleAnswers = possibleAnswers;
        questionChoixMultiple.rightAnswerIndex = rightAnswerIndex;
        questionChoixMultiple.points = points;

        return questionChoixMultipleRepository.save(questionChoixMultiple);
    }

    async function getQuestionsChoixMultiples(qcmIds: number[]) {
        const questionsChoixMultiple = await questionChoixMultipleRepository.find({
            where: { id: In(qcmIds) },
        });
        return questionsChoixMultiple.reduce((acc, questionChoixMultiple) => {
            return { ...acc, [questionChoixMultiple.id]: questionChoixMultiple };
        }, {} as Record<number, QuestionChoixMultiple>);
    }

    async function getAllQuestionsChoixMultiples() {
        const questionsChoixMultiple = await questionChoixMultipleRepository.find({
            relations: ['exam'],
            select: { exam: { id: true } },
        });
        return mapEntities(questionsChoixMultiple);
    }

    async function bulkInsertQcm(questionsChoixMultiple: Array<QuestionChoixMultiple>) {
        return questionChoixMultipleRepository.insert(questionsChoixMultiple);
    }
}
