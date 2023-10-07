import { dataSource } from '../../dataSource';
import { Attempt, buildAttemptService } from '../attempt';
import { Exam, buildExamService } from '../exam';
import { PhraseMelangee, buildPhraseMelangeeService } from '../phraseMelangee';
import { PhraseMelangeeAnswer, buildPhraseMelangeeAnswerService } from '../phraseMelangeeAnswer';
import { QcmAnswer, buildQcmAnswerService } from '../qcmAnswer';
import { QuestionChoixMultiple, buildQuestionChoixMultipleService } from '../questionChoixMultiple';
import { QuestionTrou, buildQuestionTrouService } from '../questionTrou';
import { QuestionTrouAnswer, buildQuestionTrouAnswerService } from '../questionTrouAnswer';
import { Student, buildStudentService } from '../student';
import { User, buildUserService } from '../user';
import { anonymizedDataType } from './types';

export { buildAnonymizedDataService };

function buildAnonymizedDataService() {
    const studentService = buildStudentService();
    const examService = buildExamService();
    const questionTrouService = buildQuestionTrouService();
    const qcmService = buildQuestionChoixMultipleService();
    const phraseMelangeeService = buildPhraseMelangeeService();
    const attemptService = buildAttemptService();
    const userService = buildUserService();
    const qcmAnswerService = buildQcmAnswerService();
    const questionTrouAnswerService = buildQuestionTrouAnswerService();
    const phraseMelangeeAnswerService = buildPhraseMelangeeAnswerService();

    return { getAnonymizedData, insertAnonymizedData };

    async function getAnonymizedData(): Promise<anonymizedDataType> {
        const students = await studentService.getAllAnonymizedStudents();
        const exams = await examService.getAllExams();
        const questionsTrou = await questionTrouService.getAllQuestionsTrou();
        const questionsChoixMultiple = await qcmService.getAllQuestionsChoixMultiples();
        const phrasesMelangees = await phraseMelangeeService.getAllPhrasesMelangees();
        const attempts = await attemptService.getAllAttempts();
        const users = await userService.getAllAnonymizedUsers();
        const qcmAnswers = await qcmAnswerService.getAllQcmAnswers();
        const questionTrouAnswers = await questionTrouAnswerService.getAllQuestionTrouAnswers();
        const phraseMelangeeAnswers =
            await phraseMelangeeAnswerService.getAllPhraseMelangeeAnswers();

        return {
            students,
            exams,
            questionsTrou,
            questionsChoixMultiple,
            phrasesMelangees,
            attempts,
            users,
            qcmAnswers,
            questionTrouAnswers,
            phraseMelangeeAnswers,
        };
    }

    async function insertAnonymizedData(anonymizedData: anonymizedDataType) {
        const users = Object.values(anonymizedData.users);
        const exams = Object.values(anonymizedData.exams).map((exam) => ({
            ...exam,
            user: exam.user ? anonymizedData.users[exam.user.id] : undefined,
        }));
        const students = Object.values(anonymizedData.students).map((student) => ({
            ...student,
            user: student.user ? anonymizedData.users[student.user.id] : undefined,
        }));

        const attempts = Object.values(anonymizedData.attempts).map((attempt) => ({
            ...attempt,
            student: anonymizedData.students[attempt.student.id],
            exam: anonymizedData.exams[attempt.exam.id],
        }));
        const questionsTrou = Object.values(anonymizedData.questionsTrou).map((questionTrou) => ({
            ...questionTrou,
            exam: anonymizedData.exams[questionTrou.exam.id],
        }));
        const questionsChoixMultiple = Object.values(anonymizedData.questionsChoixMultiple).map(
            (questionChoixMultiple) => ({
                ...questionChoixMultiple,
                exam: anonymizedData.exams[questionChoixMultiple.exam.id],
            }),
        );
        const phrasesMelangees = Object.values(anonymizedData.phrasesMelangees).map(
            (phraseMelangee) => ({
                ...phraseMelangee,
                exam: anonymizedData.exams[phraseMelangee.exam.id],
            }),
        );

        const qcmAnswers = Object.values(anonymizedData.qcmAnswers).map((qcmAnswer) => ({
            ...qcmAnswer,
            attempt: anonymizedData.attempts[qcmAnswer.attempt.id],
            questionChoixMultiple:
                anonymizedData.questionsChoixMultiple[qcmAnswer.questionChoixMultiple.id],
        }));
        const questionTrouAnswers = Object.values(anonymizedData.questionTrouAnswers).map(
            (questionTrouAnswer) => ({
                ...questionTrouAnswer,
                attempt: anonymizedData.attempts[questionTrouAnswer.attempt.id],
                questionTrou: anonymizedData.questionsTrou[questionTrouAnswer.questionTrou.id],
            }),
        );
        const phraseMelangeeAnswers = Object.values(anonymizedData.phraseMelangeeAnswers).map(
            (phraseMelangeeAnswer) => ({
                ...phraseMelangeeAnswer,
                attempt: anonymizedData.attempts[phraseMelangeeAnswer.attempt.id],
                phraseMelangee:
                    anonymizedData.phrasesMelangees[phraseMelangeeAnswer.phraseMelangee.id],
            }),
        );

        await dataSource.getRepository(PhraseMelangeeAnswer).delete({});
        await dataSource.getRepository(QuestionTrouAnswer).delete({});
        await dataSource.getRepository(QcmAnswer).delete({});
        await dataSource.getRepository(PhraseMelangee).delete({});
        await dataSource.getRepository(QuestionChoixMultiple).delete({});
        await dataSource.getRepository(QuestionTrou).delete({});
        await dataSource.getRepository(Attempt).delete({});
        await dataSource.getRepository(Student).delete({});
        await dataSource.getRepository(Exam).delete({});
        await dataSource.getRepository(User).delete({});

        await userService.bulkInsertUsers(users);
        await examService.bulkInsertExams(exams);
        await studentService.bulkInsertStudents(students);
        await attemptService.bulkInsertAttempts(attempts);

        await questionTrouService.bulkInsertQuestionsTrou(questionsTrou);
        await qcmService.bulkInsertQcm(questionsChoixMultiple);
        await phraseMelangeeService.bulkInsertPhrasesMelangees(phrasesMelangees);

        await qcmAnswerService.bulkInsertQcmAnswers(qcmAnswers);
        await questionTrouAnswerService.bulkInsertQuestionTrouAnswers(questionTrouAnswers);
        await phraseMelangeeAnswerService.bulkInsertPhraseMelangeeAnswers(phraseMelangeeAnswers);
        return;
    }
}
