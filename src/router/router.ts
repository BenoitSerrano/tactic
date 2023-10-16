import Express from 'express';
import Joi from 'joi';
import { buildController } from '../lib/buildController';
import { buildExamController } from '../modules/exam';
import { buildStudentController } from '../modules/student';
import { buildAttemptController } from '../modules/attempt';
import { buildQuestionController } from '../modules/question';
import { buildUserController } from '../modules/user';
import { accessControlBuilder } from '../lib/accessControlBuilder';

const router = Express.Router();
const examController = buildExamController();
const userController = buildUserController();
const studentController = buildStudentController();
const questionController = buildQuestionController();
const attemptController = buildAttemptController();

router.post('/users', buildController(userController.createUser));
router.post('/login', buildController(userController.login));

router.get(
    '/students',
    buildController(studentController.getStudentsWithAttempts, {
        checkAuthorization: accessControlBuilder.isLoggedIn(),
    }),
);
router.patch(
    '/students/:studentId',
    buildController(studentController.patchStudent, {
        schema: Joi.object({
            comment: Joi.string().required(),
        }),
    }),
);
router.delete(
    '/students/:studentId',
    buildController(studentController.deleteStudent, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'student', key: 'studentId' },
        ]),
    }),
);
router.get('/students/:email', buildController(studentController.getStudentId));

router.post(
    '/student-list',
    buildController(studentController.createStudents, {
        checkAuthorization: accessControlBuilder.isLoggedIn(),
        schema: Joi.object({
            emails: Joi.array().items(Joi.string()),
        }),
    }),
);
router.get(
    '/exams',
    buildController(examController.getExams, {
        checkAuthorization: accessControlBuilder.isLoggedIn(),
    }),
);

router.delete(
    '/exams/:examId',
    buildController(examController.deleteExam, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    }),
);

router.get('/exams/:examId', buildController(examController.getExam));
router.get(
    '/exams/:examId/results',
    buildController(examController.getExamResults, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    }),
);

router.post(
    '/exams',
    buildController(examController.createExam, {
        checkAuthorization: accessControlBuilder.isLoggedIn(),
        schema: Joi.object({
            name: Joi.string().required(),
            duration: Joi.number().required(),
        }),
    }),
);

router.post(
    '/exams/:examId/questions',
    buildController(questionController.createQuestion, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            title: Joi.string().allow(''),
            kind: Joi.string().valid('qcm', 'questionTrou', 'phraseMelangee'),
            rightAnswers: Joi.array().items(Joi.string()),
            possibleAnswers: Joi.array().items(Joi.string()),
            acceptableAnswers: Joi.array().items(Joi.string().allow('')),
            points: Joi.number(),
        }),
    }),
);

router.delete(
    `/exams/:examId/questions/:questionId`,
    buildController(questionController.deleteQuestion, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    }),
);

router.patch(
    '/exams/:examId/questions/:questionId',
    buildController(questionController.updateQuestion, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            title: Joi.string().allow(''),
            rightAnswers: Joi.array().items(Joi.string()),
            possibleAnswers: Joi.array().items(Joi.string()),
            acceptableAnswers: Joi.array().items(Joi.string().allow('')),
            points: Joi.number(),
        }),
    }),
);

router.get(
    '/exams/:examId/students/:studentId/attempts',
    buildController(attemptController.searchAttempts),
);

router.post(
    '/exams/:examId/students/:studentId/empty-attempt',
    buildController(attemptController.createEmptyAttempt),
);

router.post(
    '/exams/:examId/students/:studentId/attempts',
    buildController(attemptController.createAttempt),
);

//TODO : add check user is allowed to access this route
router.get(
    '/attempts/:attemptId/with-answers',
    buildController(attemptController.fetchAttemptWithAnswers),
);
router.get(
    '/attempts/:attemptId/without-answers',
    buildController(attemptController.fetchAttemptWithoutAnswers),
);

router.put(
    '/attempts/:attemptId',
    buildController(attemptController.updateAttempt, {
        schema: Joi.object<Record<string, string>>({}).pattern(
            Joi.string().allow(''),
            Joi.string().allow(''),
        ),
    }),
);

router.patch(
    '/attempts/:attemptId/has-been-treated',
    buildController(attemptController.updateAttemptTreatmentStatus, {
        schema: Joi.object({ hasBeenTreated: Joi.boolean().required() }),
    }),
);

router.patch(
    '/attempts/:attemptId/cheating-summary',
    buildController(attemptController.updateAttemptCheatingSummary, {
        schema: Joi.object({
            roundTrips: Joi.number().required(),
            timeSpentOutside: Joi.number().required(),
        }),
    }),
);

router.delete('/attempts/:attemptId', buildController(attemptController.deleteAttempt));

export { router };
