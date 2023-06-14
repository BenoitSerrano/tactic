import Express from 'express';
import { buildExamController } from './modules/exam';
import { buildController } from './lib/buildController';
import Joi from 'joi';
import { buildQuestionChoixMultipleController } from './modules/questionChoixMultiple/questionChoixMultiple.controller';

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
    '/exams/:examId/question-choix-multiple',
    buildController(questionChoixMultipleController.createQuestionChoixMultiple),
);

export { router };
