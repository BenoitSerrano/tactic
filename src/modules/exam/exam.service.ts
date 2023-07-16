import { Exam } from './Exam.entity';
import { dataSource } from '../../dataSource';
import { examAdaptator } from './exam.adaptator';

export { buildExamService };

function buildExamService() {
    const examRepository = dataSource.getRepository(Exam);
    const examService = {
        createExam,
        getExams,
        getExam,
        getExamResults,
    };

    return examService;

    async function createExam(name: string, duration: number) {
        const exam = new Exam();
        exam.name = name;
        exam.duration = duration;
        return examRepository.save(exam);
    }

    async function getExams() {
        return examRepository.find();
    }

    async function getExam(examId: string) {
        return examRepository.findOneOrFail({
            where: { id: examId },
            order: {
                questionsChoixMultiple: { order: 'ASC' },
                questionsTrou: { order: 'ASC' },
                phrasesMelangees: { order: 'ASC' },
            },
            relations: ['questionsChoixMultiple', 'questionsTrou', 'phrasesMelangees'],
        });
    }

    async function getExamResults(examId: string) {
        console.time('examResults');
        const examWithAttempts = await examRepository.findOneOrFail({
            where: { id: examId },
            relations: [
                'attempts',
                'attempts.student',
                'questionsChoixMultiple',
                'questionsTrou',
                'phrasesMelangees',
                'attempts.qcmAnswers',
                'attempts.qcmAnswers.questionChoixMultiple',
                'attempts.questionTrouAnswers',
                'attempts.questionTrouAnswers.questionTrou',
                'attempts.phraseMelangeAnswers',
                'attempts.phraseMelangeAnswers.phraseMelangee',
            ],
        });
        console.timeLog('examResults');

        const examWithResults = examAdaptator.convertExamWithAttemptsToResults(examWithAttempts);
        console.timeEnd('examResults');

        return examWithResults;
    }
}
