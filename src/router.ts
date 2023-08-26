import Express from 'express';
import Joi from 'joi';
import { buildController } from './lib/buildController';
import { buildExamController } from './modules/exam';
import { buildQuestionChoixMultipleController } from './modules/questionChoixMultiple';
import { buildStudentController } from './modules/student';
import { buildAttemptController } from './modules/attempt';
import { buildQcmAnswerController } from './modules/qcmAnswer';
import { buildQuestionTrouController } from './modules/questionTrou';
import { buildQuestionTrouAnswerController } from './modules/questionTrouAnswer';
import { buildPhraseMelangeeController } from './modules/phraseMelangee';
import { buildPhraseMelangeeAnswerController } from './modules/phraseMelangeeAnswer';
import { buildUserController } from './modules/user';

const router = Express.Router();
const examController = buildExamController();
const userController = buildUserController();
const studentController = buildStudentController();
const questionTrouController = buildQuestionTrouController();
const questionChoixMultipleController = buildQuestionChoixMultipleController();
const attemptController = buildAttemptController();
const qcmAnswerController = buildQcmAnswerController();
const questionTrouAnswerController = buildQuestionTrouAnswerController();
const phraseMelangeeController = buildPhraseMelangeeController();
const phraseMelangeeAnswerController = buildPhraseMelangeeAnswerController();

router.post('/users', buildController(userController.createUser));

router.get('/students', buildController(studentController.getStudentsWithAttempts));
router.patch(
    '/students/:studentId',
    buildController(studentController.patchStudent, {
        schema: Joi.object({
            comment: Joi.string().required(),
        }),
    }),
);
router.delete('/students/:studentId', buildController(studentController.deleteStudent));
router.get('/students/:email', buildController(studentController.getStudentId));

router.post(
    '/student-list',
    buildController(studentController.createStudents, {
        schema: Joi.object({
            emails: Joi.array().items(Joi.string()),
        }),
    }),
);
router.get('/exams', buildController(examController.getExams));

router.get('/exams/:examId', buildController(examController.getExam));
router.get('/exams/:examId/results', buildController(examController.getExamResults));

router.post(
    '/exams',
    buildController(examController.createExam, {
        schema: Joi.object({
            name: Joi.string().required(),
            duration: Joi.number().required(),
        }),
    }),
);

router.post(
    '/exams/:examId/questions-choix-multiple',
    buildController(questionChoixMultipleController.createQuestionChoixMultiple, {
        schema: Joi.object({
            title: Joi.string(),
            rightAnswerIndex: Joi.number().required(),
            possibleAnswers: Joi.array().items(Joi.string().allow('')),
        }),
    }),
);

router.put(
    '/exams/:examId/questions-choix-multiple/:qcmId',
    buildController(questionChoixMultipleController.updateQuestionChoixMultiple, {
        schema: Joi.object({
            title: Joi.string(),
            rightAnswerIndex: Joi.number().required(),
            possibleAnswers: Joi.array().items(Joi.string().allow('')),
        }),
    }),
);

router.post(
    '/exams/:examId/questions-trou',
    buildController(questionTrouController.createQuestionTrou, {
        schema: Joi.object({
            beforeText: Joi.string().allow(''),
            afterText: Joi.string().allow(''),
            rightAnswers: Joi.array().items(Joi.string()),
            acceptableAnswers: Joi.array().items(Joi.string().allow('')),
            points: Joi.number(),
        }),
    }),
);

router.patch(
    '/exams/:examId/questions-trou/:questionTrouId',
    buildController(questionTrouController.updateQuestionTrou, {
        schema: Joi.object({
            beforeText: Joi.string().allow(''),
            afterText: Joi.string().allow(''),
            rightAnswers: Joi.array().items(Joi.string()),
            acceptableAnswers: Joi.array().items(Joi.string().allow('')),
            points: Joi.number(),
        }),
    }),
);

router.post(
    '/exams/:examId/phrases-melangees',
    buildController(phraseMelangeeController.createPhraseMelangee, {
        schema: Joi.object({
            shuffledPhrase: Joi.string().required(),
            correctPhrases: Joi.array().items(Joi.string()),
            words: Joi.array().items(Joi.string()),
        }),
    }),
);

router.put(
    '/exams/:examId/phrases-melangees/:phraseMelangeeId',
    buildController(phraseMelangeeController.updatePhraseMelangee, {
        schema: Joi.object({
            shuffledPhrase: Joi.string().required(),
            correctPhrases: Joi.array().items(Joi.string()),
            words: Joi.array().items(Joi.string()),
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

router.get('/attempts/:attemptId', buildController(attemptController.fetchAttempt));
router.get(
    '/attempts/:attemptId/without-answers',
    buildController(attemptController.fetchAttemptWithoutAnswers),
);

router.post(
    '/attempts/:attemptId/questionsChoixMultiple/:qcmId',
    buildController(qcmAnswerController.createOrUpdateQcmAnswer, {
        schema: Joi.object({
            choice: Joi.number().required(),
        }),
    }),
);

router.patch(
    '/attempts/:attemptId/hasBeenTreated',
    buildController(attemptController.updateAttemptTreatmentStatus, {
        schema: Joi.object({ hasBeenTreated: Joi.boolean().required() }),
    }),
);

router.post(
    '/attempts/:attemptId/phrases-melangees/:phraseMelangeeId',
    buildController(phraseMelangeeAnswerController.createOrUpdatePhraseMelangeeAnswer, {
        schema: Joi.object({
            answer: Joi.string().required(),
        }),
    }),
);

router.post(
    '/attempts/:attemptId/questions-trou/:questionTrouId',
    buildController(questionTrouAnswerController.createOrUpdateQuestionTrouAnswer, {
        schema: Joi.object({
            answer: Joi.string().required(),
        }),
    }),
);

router.delete('/attempts/:attemptId', buildController(attemptController.deleteAttempt));

export { router };
