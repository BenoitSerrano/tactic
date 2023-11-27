import Express from 'express';
import Joi from 'joi';
import { buildController } from '../lib/buildController';
import { buildExamController } from '../modules/exam';
import { buildStudentController } from '../modules/student';
import { buildAttemptController } from '../modules/attempt';
import { buildQuestionController, questionKinds } from '../modules/question';
import { buildUserController } from '../modules/user';
import { accessControlBuilder } from '../lib/accessControlBuilder';
import { buildExerciseController } from '../modules/exercise';
import { buildResetPasswordRequestController } from '../modules/resetPasswordRequest';
import { buildGroupController } from '../modules/group/group.controller';

const router = Express.Router();
const examController = buildExamController();
const userController = buildUserController();
const studentController = buildStudentController();
const questionController = buildQuestionController();
const attemptController = buildAttemptController();
const exerciseController = buildExerciseController();
const resetPasswordRequestController = buildResetPasswordRequestController();
const groupController = buildGroupController();

router.post('/users', buildController(userController.createUser));
router.post('/login', buildController(userController.login));

router.get(
    '/groups/:groupId/students',
    buildController(studentController.getStudentsWithAttempts, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
    }),
);

router.delete(
    '/groups/:groupId/students/:studentId',
    buildController(studentController.deleteStudent, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
    }),
);

router.get('/students/:email', buildController(studentController.fetchStudentByEmail));

router.post(
    '/groups/:groupId/students',
    buildController(studentController.createStudents, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
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

router.get('/all-exams', buildController(examController.getAllExams));

router.delete(
    '/exams/:examId',
    buildController(examController.deleteExam, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    }),
);

router.get('/exams/:examId', buildController(examController.getExam));
router.get('/exams/:examId/without-answers', buildController(examController.getExamWithoutAnswers));
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

router.put(
    '/exams/:examId',
    buildController(examController.updateExam, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            name: Joi.string().required(),
            duration: Joi.number().required(),
        }),
    }),
);

router.post(
    '/exams/:examId/questions/:questionId/right-answers',
    buildController(questionController.addQuestionRightAnswer, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({ rightAnswer: Joi.string() }),
    }),
);

router.post(
    '/exams/:examId/questions/:questionId/acceptable-answers',
    buildController(questionController.addQuestionAcceptableAnswer, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({ acceptableAnswer: Joi.string() }),
    }),
);

router.delete(
    '/exams/:examId/questions/:questionId/ok-answers',
    buildController(questionController.removeOkAnswer, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({ okAnswer: Joi.string() }),
    }),
);

router.post(
    '/exams/:examId/exercises/:exerciseId/questions',
    buildController(questionController.createQuestion, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            title: Joi.string().allow(''),
            kind: Joi.string().valid(...questionKinds),
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

router.get(`/exams/:examId/exercises/:exerciseId`, buildController(exerciseController.getExercise));
router.patch(
    `/exams/:examId/exercises/order`,
    buildController(exerciseController.updateExercisesOrder, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            orders: Joi.array().items(
                Joi.object({ id: Joi.number().required(), order: Joi.number().required() }),
            ),
        }),
    }),
);

router.post(
    `/exams/:examId/exercises`,
    buildController(exerciseController.createExercise, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
        schema: Joi.object({
            name: Joi.string().required(),
            instruction: Joi.string().required().allow(''),
            defaultPoints: Joi.number().required(),
            defaultQuestionKind: Joi.string().valid(...questionKinds),
        }),
    }),
);

router.put(
    `/exams/:examId/exercises/:exerciseId`,
    buildController(exerciseController.updateExercise, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
        schema: Joi.object({
            name: Joi.string().required(),
            instruction: Joi.string().required().allow(''),
            defaultPoints: Joi.number().required(),
        }),
    }),
);

router.delete(
    `/exams/:examId/exercises/:exerciseId`,
    buildController(exerciseController.deleteExercise, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    }),
);

router.patch(
    `/exams/:examId/exercises/:exerciseId/questions/order`,
    buildController(questionController.updateQuestionsOrder, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
        schema: Joi.object({
            orders: Joi.array().items(
                Joi.object({ id: Joi.number().required(), order: Joi.number().required() }),
            ),
        }),
    }),
);

router.put(
    '/exams/:examId/exercises/:exerciseId/questions/:questionId',
    buildController(questionController.updateQuestion, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
        schema: Joi.object({
            title: Joi.string(),
            rightAnswers: Joi.array().items(Joi.string().allow('')),
            possibleAnswers: Joi.array().items(Joi.string().allow('')),
            acceptableAnswers: Joi.array().items(Joi.string().allow('')),
            points: Joi.number(),
        }),
    }),
);

router.get(
    '/exams/:examId/attempts/count-by-correction-status',
    buildController(attemptController.fetchAttemptsCountByCorrectionStatus, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    }),
);

router.get(
    '/exams/:examId/students/:studentId/attempts',
    buildController(attemptController.searchAttempts),
);

router.post(
    '/exams/:examId/students/:studentId/attempts',
    buildController(attemptController.createAttempt),
);

router.get(
    '/exams/:examId/attempts/:attemptId/with-answers',
    buildController(attemptController.fetchAttemptWithAnswers, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    }),
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
    '/attempts/:attemptId/cheating-summary',
    buildController(attemptController.updateAttemptCheatingSummary, {
        schema: Joi.object({
            roundTrips: Joi.number().required(),
            timeSpentOutside: Joi.number().required(),
        }),
    }),
);

router.delete(
    '/exams/:examId/attempts/:attemptId',
    buildController(attemptController.deleteAttempt, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    }),
);

// TODO vérifier le format en entrée
router.patch(
    '/attempts/:attemptId/:questionId/mark',
    buildController(attemptController.updateMark),
);
router.patch(
    '/attempts/:attemptId/endedAt',
    buildController(attemptController.updateAttemptEndedAt),
);

router.delete(
    '/exams/:examId/attempts/:attemptId/endedAt',
    buildController(attemptController.deleteAttemptEndedAt, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    }),
);

router.patch(
    '/exams/:examId/attempts/:attemptId/correctedAt',
    buildController(attemptController.updateAttemptCorrectedAt, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    }),
);

router.delete(
    '/exams/:examId/attempts/:attemptId/correctedAt',
    buildController(attemptController.deleteAttemptCorrectedAt, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    }),
);

router.post(
    '/reset-password-requests',
    buildController(resetPasswordRequestController.createResetPasswordRequest, {
        schema: Joi.object({ email: Joi.string().required() }),
    }),
);

router.get(
    '/reset-password-requests/:resetPasswordRequestId/user',
    buildController(resetPasswordRequestController.fetchResetPasswordRequestUser),
);

router.patch(
    '/reset-password-requests/:resetPasswordRequestId/user/password',
    buildController(resetPasswordRequestController.resetPassword, {
        schema: Joi.object({ password: Joi.string().required() }),
    }),
);

router.get(
    '/groups',
    buildController(groupController.fetchGroups, {
        checkAuthorization: accessControlBuilder.isLoggedIn(),
    }),
);

router.post(
    '/groups',
    buildController(groupController.createGroup, {
        checkAuthorization: accessControlBuilder.isLoggedIn(),
        schema: Joi.object({ name: Joi.string().required() }),
    }),
);

router.patch(
    '/groups/:groupId/students/:studentId/new-group/:newGroupId',
    buildController(studentController.changeGroup, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
    }),
);

router.delete(
    '/groups/:groupId',
    buildController(groupController.deleteGroup, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
    }),
);

export { router };
