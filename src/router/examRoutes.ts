import Joi from 'joi';
import { accessControlBuilder } from './lib/accessControlBuilder';
import { buildExamController } from '../modules/exam';
import { routeType } from './types';

const examController = buildExamController();

const examRoutes: Array<routeType<any, any, any>> = [
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
        path: '/exams/:examId/with-questions',
        isAuthenticated: true,
        controller: examController.getExamWithQuestions,
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
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
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
        checkAuthorization: accessControlBuilder.assertHasRightPlanForCreation('exam'),
    },
    {
        method: 'POST',
        path: '/exams/:examId/duplicate',
        isAuthenticated: true,
        controller: examController.duplicateExam,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/name',
        isAuthenticated: true,
        controller: examController.updateExamName,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            name: Joi.string(),
        }),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/edgeText',
        isAuthenticated: true,
        controller: examController.updateExamEdgeText,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            kind: Joi.string().valid('start', 'end'),
            text: Joi.string().required().allow(null),
        }),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/duration',
        isAuthenticated: true,
        controller: examController.updateExamDuration,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            duration: Joi.number().allow(null),
        }),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/archivedAt',
        isAuthenticated: true,
        controller: examController.updateExamArchivedAt,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            archive: Joi.boolean(),
        }),
    },
    {
        method: 'DELETE',
        path: '/exams/:examId',
        isAuthenticated: true,
        controller: examController.deleteExam,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    },
    {
        method: 'GET',
        path: '/exams/:examId/shouldDisplayRightAnswers',
        isAuthenticated: true,
        controller: examController.fetchShouldDisplayRightAnswersForExamId,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/shouldDisplayRightAnswers',
        isAuthenticated: true,
        controller: examController.updateShouldDisplayRightAnswersForExamId,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            shouldDisplayRightAnswers: Joi.boolean(),
        }),
    },
];

export { examRoutes };
