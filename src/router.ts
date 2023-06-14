import Express from 'express';
import Joi from 'joi';
import { buildExamController } from './modules/exam';
import { buildController } from './lib/buildController';
import { buildQuestionChoixMultipleController } from './modules/questionChoixMultiple';

const router = Express.Router();
const examController = buildExamController();
const questionChoixMultipleController = buildQuestionChoixMultipleController();

router.get('/exams', buildController(examController.getExams));

router.get('/exams/:examId', buildController(examController.getExam));

router.post(
    '/exams',
    buildController(examController.createExam, {
        schema: Joi.object({
            name: Joi.string().required(),
        }),
    }),
);

router.post(
    '/exams/:examId/questions-choix-multiple',
    buildController(questionChoixMultipleController.createQuestionChoixMultiple),
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

export { router };
