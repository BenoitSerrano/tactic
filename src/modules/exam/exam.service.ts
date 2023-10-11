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
import { mapEntities } from '../../lib/mapEntities';

export { buildExamService };

function buildExamService() {
    const examRepository = dataSource.getRepository(Exam);
    const examService = {
        createExam,
        getExams,
        getAllExams,
        getExam,
        deleteExam,
        getExamResults,
        bulkInsertExams,
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
        const studentService = buildStudentService();
        const qcmService = buildQuestionChoixMultipleService();
        const questionTrouService = buildQuestionTrouService();
        const phraseMelangeeService = buildPhraseMelangeeService();

        const exam = await examRepository.findOneOrFail({
            where: { id: examId },
            select: {
                phrasesMelangees: { id: true },
                questionsTrou: { id: true },
                questionsChoixMultiple: { id: true },
            },
            relations: ['questionsChoixMultiple', 'questionsTrou', 'phrasesMelangees'],
        });
        const attempts = await examRepository.findOneOrFail({
            where: { id: examId },
            select: {
                attempts: {
                    id: true,
                    startedAt: true,
                    updatedAt: true,
                    student: { id: true },
                    hasBeenTreated: true,
                    roundTrips: true,
                    timeSpentOutside: true,
                    answers: true,
                },
            },
            relations: ['attempts', 'attempts.student'],
        });
        const studentIds = attempts.attempts.map((attempt) => attempt.student.id);
        const students = await studentService.getStudents(studentIds);

        const qcmIds = exam.questionsChoixMultiple.map((qcm) => qcm.id);
        const questionsChoixMultiple = await qcmService.getQuestionsChoixMultiples(qcmIds);

        const questionTrouIds = exam.questionsTrou.map((questionTrou) => questionTrou.id);
        const questionsTrou = await questionTrouService.getQuestionsTrou(questionTrouIds);

        const phraseMelangeeIds = exam.phrasesMelangees.map((phraseMelangee) => phraseMelangee.id);
        const phrasesMelangees = await phraseMelangeeService.getPhrasesMelangees(phraseMelangeeIds);

        const examWithResults = examAdaptator.convertExamWithAttemptsToResults(
            attempts.attempts,
            students,
            { questionsChoixMultiple, questionsTrou, phrasesMelangees },
        );

        return examWithResults;
    }

    async function deleteExam(examId: string) {
        const examRepository = dataSource.getRepository(Exam);

        const result = await examRepository.delete({ id: examId });
        return result.affected == 1;
    }

    async function getAllExams() {
        const exams = await examRepository.find();

        return mapEntities(exams);
    }

    async function bulkInsertExams(exams: Array<Exam>) {
        return examRepository.insert(exams);
    }
}
