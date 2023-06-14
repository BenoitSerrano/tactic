import { dataSource } from '../../dataSource';
import { buildExamService } from '../exam/exam.service';
import { QuestionChoixMultiple } from '../questionChoixMultiple';

export { buildQuestionChoixMultipleService };

function buildQuestionChoixMultipleService() {
    const questionChoixMultipleRepository = dataSource.getRepository(QuestionChoixMultiple);
    const examService = {
        createQuestionChoixMultiple,
        updateQuestionChoixMultiple,
    };

    return examService;

    async function createQuestionChoixMultiple(examId: string) {
        const examService = buildExamService();
        const exam = await examService.getExam(examId);

        const questionChoixMultiple = new QuestionChoixMultiple();
        questionChoixMultiple.possibleAnswers = ['', '', '', ''];
        questionChoixMultiple.rightAnswerIndex = 0;
        questionChoixMultiple.title = '';
        questionChoixMultiple.exam = exam;
        return questionChoixMultipleRepository.save(questionChoixMultiple);
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
