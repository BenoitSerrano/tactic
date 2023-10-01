import { Exam } from './Exam.entity';
import { dataSource } from '../../dataSource';
import { examAdaptator } from './exam.adaptator';
import { User } from '../user';
import { buildQcmAnswerService } from '../qcmAnswer';
import { buildQuestionTrouAnswerService } from '../questionTrouAnswer';
import { buildPhraseMelangeeAnswerService } from '../phraseMelangeeAnswer';
import { buildStudentService } from '../student';
import { buildQuestionChoixMultipleService } from '../questionChoixMultiple';
import { buildQuestionTrouService } from '../questionTrou';
import { buildPhraseMelangeeService } from '../phraseMelangee';

export { buildExamService };

function buildExamService() {
    const examRepository = dataSource.getRepository(Exam);
    const examService = {
        createExam,
        getExams,
        getExam,
        deleteExam,
        getExamResults,
    };

    return examService;

    async function createExam(name: string, duration: number, user?: User) {
        const exam = new Exam();
        exam.name = name;
        exam.duration = duration;
        exam.user = user;
        return examRepository.save(exam);
    }

    async function getExams(user?: User) {
        return examRepository.find({ where: { user } });
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
        const qcmAnswerService = buildQcmAnswerService();
        const questionTrouAnswerService = buildQuestionTrouAnswerService();
        const phraseMelangeeAnswerService = buildPhraseMelangeeAnswerService();
        const studentService = buildStudentService();
        const qcmService = buildQuestionChoixMultipleService();
        const questionTrouService = buildQuestionTrouService();
        const phraseMelangeeService = buildPhraseMelangeeService();

        const examWithAttempts = await examRepository.findOneOrFail({
            where: { id: examId },
            select: {
                attempts: {
                    startedAt: true,
                    updatedAt: true,
                    id: true,
                    student: { id: true },
                    qcmAnswers: { id: true },
                    phraseMelangeAnswers: { id: true },
                    questionTrouAnswers: { id: true },

                    // student: { id: true, email: true, comment: true },
                    // qcmAnswers: { id: true, choice: true, questionChoixMultiple: { id: true } },
                    hasBeenTreated: true,
                    // phraseMelangeAnswers: { id: true, answer: true, phraseMelangee: { id: true } },
                    // questionTrouAnswers: { id: true, answer: true, questionTrou: { id: true } },
                    roundTrips: true,
                    timeSpentOutside: true,
                },
                phrasesMelangees: { id: true },
                questionsTrou: { id: true },
                questionsChoixMultiple: { id: true },
                // phrasesMelangees: { id: true, points: true, correctPhrases: true },
                // questionsTrou: {
                //     id: true,
                //     points: true,
                //     acceptableAnswers: true,
                //     rightAnswers: true,
                // },
                // questionsChoixMultiple: {
                //     id: true,
                //     points: true,
                //     rightAnswerIndex: true,
                // },
            },
            relations: [
                'attempts',
                'attempts.student',
                'questionsChoixMultiple',
                'questionsTrou',
                'phrasesMelangees',
                'attempts.qcmAnswers',
                // 'attempts.qcmAnswers.questionChoixMultiple',
                'attempts.questionTrouAnswers',
                // 'attempts.questionTrouAnswers.questionTrou',
                'attempts.phraseMelangeAnswers',
                // 'attempts.phraseMelangeAnswers.phraseMelangee',
            ],
        });
        const studentIds = examWithAttempts.attempts.map((attempt) => attempt.student.id);
        const students = await studentService.getStudents(studentIds);

        const qcmAnswerIds = examWithAttempts.attempts.reduce((acc, attempt) => {
            return [...acc, ...attempt.qcmAnswers.map((qcmAnswer) => qcmAnswer.id)];
        }, [] as number[]);
        const qcmAnswers = await qcmAnswerService.getQcmAnswers(qcmAnswerIds);

        const questionTrouAnswerIds = examWithAttempts.attempts.reduce((acc, attempt) => {
            return [
                ...acc,
                ...attempt.questionTrouAnswers.map((questionTrouAnswer) => questionTrouAnswer.id),
            ];
        }, [] as number[]);
        const questionTrouAnswers = await questionTrouAnswerService.getQuestionTrouAnswers(
            questionTrouAnswerIds,
        );

        const phraseMelangeeAnswerIds = examWithAttempts.attempts.reduce((acc, attempt) => {
            return [
                ...acc,
                ...attempt.phraseMelangeAnswers.map(
                    (phraseMelangeeAnswer) => phraseMelangeeAnswer.id,
                ),
            ];
        }, [] as number[]);
        const phraseMelangeeAnswers = await phraseMelangeeAnswerService.getPhraseMelangeeAnswers(
            phraseMelangeeAnswerIds,
        );

        const qcmIds = examWithAttempts.questionsChoixMultiple.map((qcm) => qcm.id);
        const questionsChoixMultiple = await qcmService.getQuestionsChoixMultiples(qcmIds);

        const questionTrouIds = examWithAttempts.questionsTrou.map(
            (questionTrou) => questionTrou.id,
        );
        const questionsTrou = await questionTrouService.getQuestionsTrou(questionTrouIds);

        const phraseMelangeeIds = examWithAttempts.phrasesMelangees.map(
            (phraseMelangee) => phraseMelangee.id,
        );
        const phrasesMelangees = await phraseMelangeeService.getPhrasesMelangees(phraseMelangeeIds);

        const examWithResults = examAdaptator.convertExamWithAttemptsToResults(
            examWithAttempts,
            students,
            { questionsChoixMultiple, questionsTrou, phrasesMelangees },
            {
                qcmAnswers,
                questionTrouAnswers,
                phraseMelangeeAnswers,
            },
        );

        return examWithResults;
    }

    async function deleteExam(examId: string) {
        const examRepository = dataSource.getRepository(Exam);

        const result = await examRepository.delete({ id: examId });
        return result.affected == 1;
    }
}
