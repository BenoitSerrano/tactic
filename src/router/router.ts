import Express from 'express';
import Joi from 'joi';
import { buildAnonymousController, buildAuthenticatedController } from '../lib/buildController';
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

router.post('/users', buildAnonymousController(userController.createUser));
router.post('/login', buildAnonymousController(userController.login));

router.get(
    '/groups/:groupId/students',
    buildAuthenticatedController(studentController.getStudentsWithAttempts, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
    }),
);

router.delete(
    '/groups/:groupId/students/:studentId',
    buildAuthenticatedController(studentController.deleteStudent, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
    }),
);

router.get('/students/:email', buildAnonymousController(studentController.fetchStudentByEmail));

router.post(
    '/groups/:groupId/students',
    buildAuthenticatedController(studentController.createStudents, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
        schema: Joi.object({
            emails: Joi.array().items(Joi.string()),
        }),
    }),
);

router.get('/exams', buildAuthenticatedController(examController.getExams));

router.get('/all-exams', buildAnonymousController(examController.getAllExams));

router.delete(
    '/exams/:examId',
    buildAuthenticatedController(examController.deleteExam, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    }),
);

router.get('/exams/:examId', buildAnonymousController(examController.getExam));
router.get(
    '/exams/:examId/without-answers',
    buildAnonymousController(examController.getExamWithoutAnswers),
);
router.get(
    '/exams/:examId/results',
    buildAuthenticatedController(examController.getExamResults, {
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
    buildAuthenticatedController(examController.createExam, {
        schema: Joi.object({
            name: Joi.string().required(),
            duration: Joi.number().required(),
        }),
    }),
);

router.put(
    '/exams/:examId',
    buildAuthenticatedController(examController.updateExam, {
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
    buildAuthenticatedController(questionController.addQuestionRightAnswer, {
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
    buildAuthenticatedController(questionController.addQuestionAcceptableAnswer, {
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
    buildAuthenticatedController(questionController.removeOkAnswer, {
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
    buildAuthenticatedController(questionController.createQuestion, {
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
    buildAuthenticatedController(questionController.deleteQuestion, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    }),
);

router.get(
    `/exams/:examId/exercises/:exerciseId`,
    buildAuthenticatedController(exerciseController.getExercise, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    }),
);
router.patch(
    `/exams/:examId/exercises/order`,
    buildAuthenticatedController(exerciseController.updateExercisesOrder, {
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
    buildAuthenticatedController(exerciseController.createExercise, {
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
    buildAuthenticatedController(exerciseController.updateExercise, {
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
    buildAuthenticatedController(exerciseController.deleteExercise, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    }),
);

router.patch(
    `/exams/:examId/exercises/:exerciseId/questions/order`,
    buildAuthenticatedController(questionController.updateQuestionsOrder, {
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
    buildAuthenticatedController(questionController.updateQuestion, {
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
    buildAuthenticatedController(attemptController.fetchAttemptsCountByCorrectionStatus, {
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
    buildAnonymousController(attemptController.searchAttempts),
);

router.post(
    '/exams/:examId/students/:studentId/attempts',
    buildAnonymousController(attemptController.createAttempt),
);

router.get(
    '/exams/:examId/attempts/:attemptId/with-answers',
    buildAuthenticatedController(attemptController.fetchAttemptWithAnswers, {
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
    buildAnonymousController(attemptController.fetchAttemptWithoutAnswers),
);

router.put(
    '/attempts/:attemptId',
    buildAnonymousController(attemptController.updateAttempt, {
        schema: Joi.object<Record<string, string>>({}).pattern(
            Joi.string().allow(''),
            Joi.string().allow(''),
        ),
    }),
);

router.patch(
    '/attempts/:attemptId/cheating-summary',
    buildAnonymousController(attemptController.updateAttemptCheatingSummary, {
        schema: Joi.object({
            roundTrips: Joi.number().required(),
            timeSpentOutside: Joi.number().required(),
        }),
    }),
);

router.delete(
    '/exams/:examId/attempts/:attemptId',
    buildAuthenticatedController(attemptController.deleteAttempt, {
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
    '/exams/:examId/attempts/:attemptId/questions/:questionId/mark',
    buildAuthenticatedController(attemptController.updateMark, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    }),
);
router.patch(
    '/attempts/:attemptId/endedAt',
    buildAnonymousController(attemptController.updateAttemptEndedAt),
);

router.delete(
    '/exams/:examId/attempts/:attemptId/endedAt',
    buildAuthenticatedController(attemptController.deleteAttemptEndedAt, {
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
    buildAuthenticatedController(attemptController.updateAttemptCorrectedAt, {
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
    buildAuthenticatedController(attemptController.deleteAttemptCorrectedAt, {
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
    buildAnonymousController(resetPasswordRequestController.createResetPasswordRequest, {
        schema: Joi.object({ email: Joi.string().required() }),
    }),
);

router.get(
    '/reset-password-requests/:resetPasswordRequestId/user',
    buildAnonymousController(resetPasswordRequestController.fetchResetPasswordRequestUser),
);

router.patch(
    '/reset-password-requests/:resetPasswordRequestId/user/password',
    buildAnonymousController(resetPasswordRequestController.resetPassword, {
        schema: Joi.object({ password: Joi.string().required() }),
    }),
);

router.get('/groups', buildAuthenticatedController(groupController.fetchGroups));

router.post(
    '/groups',
    buildAuthenticatedController(groupController.createGroup, {
        schema: Joi.object({ name: Joi.string().required() }),
    }),
);

router.patch(
    '/groups/:groupId/students/:studentId/new-group/:newGroupId',
    buildAuthenticatedController(studentController.changeGroup, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
    }),
);

router.delete(
    '/groups/:groupId',
    buildAuthenticatedController(groupController.deleteGroup, {
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
    }),
);

export { router };
