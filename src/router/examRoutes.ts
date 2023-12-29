import Joi from 'joi';
import { accessControlBuilder } from '../lib/accessControlBuilder';
import { buildExamController } from '../modules/exam';
import { routeType } from './types';

const examController = buildExamController();

const examRoutes: Array<routeType<any, any>> = [
    {
        method: 'GET',
        path: '/exams',
        isAuthenticated: true,
        controller: examController.getExams,
    },
    {
        method: 'GET',
        path: '/all-exams',
        isAuthenticated: false,
        controller: examController.getAllExams,
    },
    {
        method: 'GET',
        path: '/exams/:examId',
        isAuthenticated: false,
        controller: examController.getExam,
    },
    {
        method: 'GET',
        path: '/exams/:examId/without-answers',
        isAuthenticated: false,
        controller: examController.getExamWithoutAnswers,
    },
    {
        method: 'GET',
        path: '/exams/:examId/results',
        isAuthenticated: true,
        controller: examController.getExamResults,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'POST',
        path: '/exams',
        isAuthenticated: true,
        controller: examController.createExam,
        schema: Joi.object({
            name: Joi.string().required(),
            duration: Joi.number(),
        }),
    },
    {
        method: 'POST',
        path: '/exams/:examId/duplicate',
        isAuthenticated: true,
        controller: examController.duplicateExam,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId',
        isAuthenticated: true,
        controller: examController.updateExam,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            name: Joi.string(),
            duration: Joi.number(),
        }),
    },

    {
        method: 'DELETE',
        path: '/exams/:examId',
        isAuthenticated: true,
        controller: examController.deleteExam,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    },
];

export { examRoutes };
